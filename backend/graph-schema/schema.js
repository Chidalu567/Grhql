const graphql = require("graphql");
const Authors = require("../schema/Authors");
const Books = require("../schema/Books");

//manual database

//This allows us to create a node or object or type in a graphql.
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = graphql;

//Book type or node on a graph
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        const author = Author.find((x) => x.id === parent.author_id);
        console.info(author);
        return author;
      },
    },
  }),
});

//Author node
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        const books = Book.filter((x) => x.author_id === parent.id);
        console.info(books);
        return books;
      },
    },
  }),
});

//Defining the root-query or edge in graphql

/**
 * {
 * book(id:2){
 * name
 * genre
 * id
 * }
 * }
 */

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        //This is where we query the database and have access to other relations
        const result = Book.find((x) => x.id === args.id);
        return result;
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        const autr = Author.find((x) => x.id === args.id);
        return autr;
      },
    },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        return Book;
      },
    },
    authors: {
      type: GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        //FIND AUTHOR
        const oAuthor = await Authors.findOne({ name: args.name });
        if (!oAuthor) {
          const nAuthor = await Authors.create({
            name: args.name,
            age: args.age,
          });
          return nAuthor;
        } else {
          return { name: "Exist already" };
        }
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLID },
        author_name: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const auth = await Authors.findOne({ name: args.author_name });
        if (auth) {
          const id = auth.id;
          const oBook = await Books.findOne({ name: args.name });
          if (!oBook) {
            const nBook = await Books.create({
              name: args.name,
              genre: args.genre,
              authorId: id,
            });
            return nBook;
          }
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
