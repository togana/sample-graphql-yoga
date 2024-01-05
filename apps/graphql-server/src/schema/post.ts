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
    resolve: async (query, _, args) => await prisma.post.findMany({
      ...query,
      where: {
        title: {
          contains: likeEscapeString(args.input?.title ?? ''),
        },
      },
    }),
    totalCount: async (query) =>  await prisma.post.count({ ...query }),
  }),
}));

builder.mutationFields((t) => ({
  createPost: t.prismaFieldWithInput({
    type: "Post",
    input: {
      title: t.input.string({ required: true }),
      authorId: t.input.id({ required: true }),
    },
    resolve: async (query, _, args) => {
      const { id: authorId, typename } = decodeGlobalID(args.input.authorId.toString());
      // TODO: ここで typename が User であることを確認するが error の処理をうまくやりたい
      // バリデーションでどうにかできないか？
      if (typename !== 'User') {
        throw new Error(`Invalid authorId typename ${typename}`);
      }
      return await prisma.post.create({
        ...query,
        data: {
          title: args.input.title,
          author: {
            connect: {
              id: parseInt(authorId, 10),
            },
          },
        },
      });
    },
  }),
}));
