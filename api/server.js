const fs = require('fs');
const express = require("express");
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/issuetracker';

let db;

let aboutMessage = "California Reservation API v1.0";

const GraphQLDate = new GraphQLScalarType({
   name: 'GraphQLDate',
   description: 'A Date() type in GraphQL as a scalar',
   serialize(value) {
      return value;
   },
   parseValue(value) {
      return new Date(value);
   },
   parseLiteral(ast) {
      return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
   },
});

const resolvers = {
   Query: {
      about: () => aboutMessage,
      issueList,
   },
   Mutation: {
      setAboutMessage,
      issueAdd,
      issueDelete,
   },
   GraphQLDate,
};

function setAboutMessage(_, { message }) {
   return aboutMessage = message;
}

async function issueList() {
   const issues = await db.collection('issues').find({}).toArray();
   return issues;
}

async function issueAdd(_, { issue }) { //issue需更新 且和按钮事件相关联
   //issue.serial = issuesDB.length + 1; //在哪里确定序号
   console.log("wait add", issue)
   const result = await db.collection('issues').insertOne(issue);
   const savedIssue = await db.collection('issues')
    .findOne({ _id: result.insertedId });
   return savedIssue;
}

async function issueDelete(_, { id }) {
   let msg = 'deletion'
   //const savedIssue = await db.collection('issues').findOne({ id: deleteID });
   await db.collection('issues').deleteOne({id:id})
   return msg;
}

async function connectToDb() {
   const client = new MongoClient(url, { useNewUrlParser: true });
   await client.connect();
   console.log('Connected to MongoDB at', url);
   db = client.db();
}

const server = new ApolloServer({
   typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
   resolvers,
   formatError: error => {
      console.log(error);
      return error;
   },
});

const app = express();
const path = require("path");
const port = process.env.PORT || 5000;

server.applyMiddleware({ app, path: '/graphql' }); 

(async function () {
   try {
      await connectToDb();
      app.listen(port, () => {
         console.log(`The API server is running on port: ${port}`);
      });
   } catch (err) {
   console.log('ERROR:', err);
}
})();
