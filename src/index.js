const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server");
const config = require("./config");
const { Prisma } = require("../prisma/generated/index");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutations");
const { applyMiddleware } = require("graphql-middleware");
const fs = require("fs");
const { connectMessageQueueListener } = require("./Service_Mesh/listener_connector");
const { connectMessageQueuePublisher } = require("./Service_Mesh/publisher_connector");
const introspect = require("./Auth/introspection");
const { mustbeAuthenticated } = require("./Middleware/authMiddleware");

const resolvers = {
  // Add any other files that contain custom Scalar types here
  Query,
  Mutation,
};

const authenticationRequiredApplications = {
  Query:{
    notifications: mustbeAuthenticated
  },
  Mutation:{
    createNotification: mustbeAuthenticated,
    updateNotification: mustbeAuthenticated
  }
};

const typeDefs = gql(fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8"));

const schemaBeforeMiddleware = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

const schema = applyMiddleware(
  schemaBeforeMiddleware,
  authenticationRequiredApplications,
);

const server = new ApolloServer({
  schema,
  tracing: config.app.tracing,
  introspection: true,
  playground: true,
  cors: {
    origin: "*"
  }, 
  context: async (req) => ({
    ...req,    
    prisma: new Prisma(
      {
        endpoint: config.prisma.host
      }      
    ),
    token: await introspect.verifyToken(req),
  }),
});

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.info(`🚀 GraphQL Server ready at ${url}`);
});

// Launch process to listen to service message queue
if (config.rabbitMQ.user && config.rabbitMQ.password){
  connectMessageQueueListener();
  connectMessageQueuePublisher();
}