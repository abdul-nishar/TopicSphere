"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const path_1 = __importDefault(require("path"));
const migrations_1 = require("@mikro-orm/migrations");
const User_1 = require("./entities/User");
const Post_1 = require("./entities/Post");
const constants_1 = require("./constants");
exports.default = (0, postgresql_1.defineConfig)({
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        glob: "!(*.d).{js,ts}",
    },
    extensions: [migrations_1.Migrator],
    entities: [Post_1.Post, User_1.User],
    dbName: "lireddit",
    user: "postgres",
    password: "Luffy*7238",
    debug: !constants_1.__prod__,
});
//# sourceMappingURL=mikro-orm.config.js.map