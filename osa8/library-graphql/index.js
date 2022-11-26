const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql,
} = require("apollo-server");
const { v1: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

require("dotenv").config();
let JWT_SECRET = process.env.SECRET;
let MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author");
      }
      let byAuthor = (book) =>
        args.author ? book.author.name === args.author : true;
      let byGenre = (book) =>
        args.genre ? book.genres.includes(args.genre) : true;

      let allBooks = await Book.find({}).populate("author");
      return allBooks.filter(byAuthor).filter(byGenre);
    },
    allAuthors: async () => Author.find({}),
    me: (_r, _a, { currentUser }) => currentUser,
  },
  Author: {
    bookCount: async (root) => Book.count({ author: root._id }),
  },
  Mutation: {
    addBook: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Forbidden. Login first.");
      }

      let authr = await Author.findOne({ name: args.author });
      if (!authr) {
        authr = new Author({ name: args.author });
        try {
          await authr.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args.author,
          });
        }
      }
      delete args["author"];
      const book = new Book({ ...args, author: authr });
      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return book;
    },
    editAuthor: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Forbidden. Login first.");
      }

      let authr = await Author.findOne({ name: args.name });
      if (!authr) {
        return null;
      }
      authr.born = args.setBornTo;
      await authr.save();
      return authr;
    },
    createUser: async (_, args) => {
      const user = new User(args);

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLocaleLowerCase().startsWith("bearer ")) {
      let bearer = auth.substring(7);
      const decodedToken = jwt.verify(bearer, JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
