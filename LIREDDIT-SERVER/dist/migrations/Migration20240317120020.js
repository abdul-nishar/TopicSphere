"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240317120020 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240317120020 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("_id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" text not null);');
    }
    async down() {
        this.addSql('drop table if exists "post" cascade;');
    }
}
exports.Migration20240317120020 = Migration20240317120020;
//# sourceMappingURL=Migration20240317120020.js.map