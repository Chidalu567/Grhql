const { urlencoded } = require("express");
const express = require("express");
const app = express(); //create an express application
const helmet = require("helmet"); //require helment from node modules
const cors = require("cors"); //cross-origin-resource sharing
const mR = require("./routes/main");
const schema = require("./graph-schema/schema");
const mongoose = require("mongoose");

//connect to database
mongoose.connect("mongodb://localhost:27017/Graphql_tutorial", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//graphql area
const { graphqlHTTP } = require("express-graphql"); //This allows express to understand graphql and lunch its api.

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

//middleware definition
app.use(express.json());
app.use(urlencoded({ extended: false }));

//cross-origin-resources-sharing
app.use(
  cors({
    optionsSuccessStatus: 200, //option sucess status
    methods: ["GET", "POST", "DELETE", "PUT"], //methods allowed with the server
    origin: "*", //origin allowed to access the server
  })
);

//external router
app.use("/", mR);

//security
app.use(helmet.noSniff()); //noPrt sniffing
app.use(helmet.hidePoweredBy()); //hide the server engine
app.use(helmet.xssFilter()); //no cross site scripting
app.use(helmet.contentSecurityPolicy()); //hide content security policy

app.listen(5000, "localhost", () => {
  console.log("Server running on port 3000");
});
