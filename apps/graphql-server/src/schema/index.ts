import { builder } from "../builder";
import "./user";
import "./post";
// import { writeFileSync } from "fs";
// import { resolve } from "path";
// import { printSchema } from "graphql";

export const schema = builder.toSchema({});

// TODO: スキーマファイルがみたい場合は以下コメントアウトを外す
// writeFileSync(resolve(__dirname, "../../schema.graphql"), printSchema(schema));
