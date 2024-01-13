import { writeFileSync } from "fs";
import { resolve } from "path";
import { printSchema } from "graphql";
import { schema } from "../src/schema";

writeFileSync(resolve(__dirname, "../schema.graphql"), printSchema(schema));
