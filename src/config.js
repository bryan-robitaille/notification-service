require("dotenv").config();
// set runtime environment as'development' or 'production'
const env = process.env.NODE_ENV; 

// Get app basic config settings for Prisma
const appName = process.env.APP_NAME;
const prismaHost =  process.env.PRISMA_HOST;

// OpenID provider clientID and Secret
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;

// Message queue username and password
const mqUser = process.env.MQ_USER;
const mqPass = process.env.MQ_PASS;

// Email username and password
const userMail = process.env.userMail;
const passMail = process.env.passMail;
const hostMail = process.env.hostMail;
const portMail = process.env.portMail;

const development = {
 app: {
   port: 4000,
   multicore: false,
   tracing: true
 },
 prisma: {
  host: prismaHost + "/" + appName + "/dev",
  debug: true
},
 rabbitMQ:{
   host:"localhost",
   user: mqUser,
   password: mqPass
 },
 openId:{
  url:"https://account.da-an.ca",
  id:clientId,
  secret:clientSecret
},
 email:{
   email:userMail,
   password:passMail,
   host:hostMail,
   port:portMail
 }
};

const production = {
 app: {
   port: 4000,
   multicore: true,
   tracing: false
 },
 prisma: {
  host: prismaHost + "/" + appName + "/prod",
  debug: false
},
 rabbitMQ:{
  host:"quantum-mq.da-an.ca",
  user: mqUser,
  password: mqPass
},
openId:{
  url:"https://account.da-an.ca",
  id:clientId,
  secret:clientSecret
},
email:{
  email:userMail,
  password:passMail,
  host:hostMail,
  port:portMail
}
};

const config = {
 development,
 production
};

module.exports = config[env];
