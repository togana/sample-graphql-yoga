import { decodeGlobalID } from "@pothos/plugin-relay";
import { builder } from "../builder";
import { prisma } from "../db";

builder.prismaNode("Post", {
  id: { field: "id" },
  nullable: true,
  findUnique: (id) => ({ id: parseInt(id, 10) }),
  fields: (t) => ({
    title: t.exposeString("title"),
    author: t.relation("author"),
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
    resolve: async (query) => await prisma.post.findMany({ ...query }),
    totalCount: async (query) =>  await prisma.post.count({ ...query }),
  }),
}));
