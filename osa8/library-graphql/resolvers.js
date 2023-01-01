const { PubSub } = require("graphql-subscriptions");
const jwt = require("jsonwebtoken");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

require("dotenv").config();
let JWT_SECRET = process.env.SECRET;

const pubsub = new PubSub();

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

      pubsub.publish("BOOK_ADDED", { bookAdded: book });
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
