const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const graphqlHTTP = require("express-graphql").graphqlHTTP; // ES6

const graphQlSchema = require("./graphql/schema/graphQLschema");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/isAuthentication");

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hmp3jml.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
