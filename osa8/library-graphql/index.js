const { ApolloServer, UserInputError, gql } = require("apollo-server");
const { v1: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Author = require("./models/author");
const Book = require("./models/book");

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
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
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
  },
  Author: {
    bookCount: async (root) => Book.count({ author: root._id }),
  },
  Mutation: {
    addBook: async (_, args) => {
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
    editAuthor: async (_, args) => {
      let authr = await Author.findOne({ name: args.name });
      if (!authr) {
        return null;
      }
      authr.born = args.setBornTo;
      await authr.save();
      return authr;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
