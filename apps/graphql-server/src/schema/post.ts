import { decodeGlobalID } from "@pothos/plugin-relay";
import { builder } from "../builder";
import { prisma } from "../db";
import { likeEscapeString } from "./utils";

builder.prismaNode("Post", {
  id: { field: "id" },
  nullable: true,
  findUnique: (id) => ({ id: parseInt(id, 10) }),
  fields: (t) => ({
    title: t.exposeString("title"),
    author: t.relation("author"),
  }),
});

const QueryPostsInput = builder.inputType("QueryPostsInput", {
  fields: (t) => ({
    title: t.string({
      description: "Filter by title",
      required: false,
    }),
  }),
});

builder.queryFields((t) => ({
  post: t.prismaField({
    type: "Post",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _, args) => {
      const { id } = decodeGlobalID(args.id.toString());
      return await prisma.post.findUnique({
        ...query,
        where: { id: parseInt(id, 10) },
      });
    },
  }),
  posts: t.prismaConnection({
    type: "Post",
    cursor: "id",
    args: {
      input: t.arg({ type: QueryPostsInput }),
    },
    resolve: async (query, parent, args) => {
      const titleContains = args.input?.title
        ? {
            title: {
              contains: likeEscapeString(args.input.title),
            }
          }
        : {};

      const where = {
        ...titleContains,
      };

      return await prisma.post.findMany({
        ...query,
        where,
      });
    },
    totalCount: async (query) =>  await prisma.post.count({ ...query }),
  }),
}));
