// import { Options } from "@mikro-orm/postgresql";
import { defineConfig } from "@mikro-orm/postgresql";
import path from "path";
import { Migrator } from "@mikro-orm/migrations";

import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { __prod__ } from "./constants";

//  const config: Options = {
//     migrations: {
//         path: path.join(__dirname, "./migrations"),
//         glob: "!(*.d).{js,ts}",
//       },
//    entities: [Post],
//  dbName: "lireddit",
//    user: "postgres",
//    password: "Luffy*7238",
//    debug: !__prod__,
//  };

// export default config;

export default defineConfig({
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  extensions: [Migrator],
  entities: [Post, User],
  dbName: "lireddit",
  user: "postgres",
  password: "Luffy*7238",
  debug: !__prod__,
});
