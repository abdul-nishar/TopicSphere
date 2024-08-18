import express from "express";
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { MikroORM } from "@mikro-orm/postgresql";
import { buildSchema } from "type-graphql";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import cors from "cors";

// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { __prod__ } from "./constants";

const main = async () => {
  // $ Connects the database
  const orm = await MikroORM.init(mikroConfig);

  // $ Run migrations
  await orm.getMigrator().up();

  const emFork = orm.em.fork();

  // $ Run SQL
  // const post = emFork.create(Post, { title: "My First Post" });
  // await emFork.persistAndFlush(post);

  // const posts = await emFork.findAll(Post);
  // console.log(posts);

  const app = express();

  // $ Initialize client.
  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  // $ Initialize store.
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
    disableTouch: true,
    disableTTL: true,
  });

  // const corsOptions = {
  //   credentials: true,
  //   origin: "https://studio.apollographql.com",
  // };

  // $ Initialize session storage.
  app.use(
    session({
      name: "qid",
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true, // Cookie cannot be accessed in frontend javascript
        secure: __prod__, // 🔴 Cookie only works in https
        sameSite: "lax",
      },
      resave: false, // Do not save session if unmodified
      saveUninitialized: false, // session is not created and stored in the session store, if user doesn't log in or adds data to session
      secret: "My secret for redis session storage is MeowMeowZoobi",
    })
  );

  // $ Creating server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ em: emFork, req, res }),
    })
  );

  // apolloServer.applyMiddleware({
  //   app,
  //   cors: corsOptions,
  // });

  app.listen(4000, () => {
    console.log("Listening on http://localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});

console.log("Hello World");
