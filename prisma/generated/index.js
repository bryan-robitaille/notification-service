"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Status",
    embedded: false
  },
  {
    name: "actionLevel",
    embedded: false
  },
  {
    name: "Notification",
    embedded: false
  },
  {
    name: "whoDunIt",
    embedded: false
  },
  {
    name: "Email",
    embedded: false
  },
  {
    name: "Online",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_API_ENDPOINT"]}`,
  secret: `${process.env["PRISMA_SERVICE_SECRET"]}`
});
exports.prisma = new exports.Prisma();
