import { builder } from "../builder";

builder.prismaNode("User", {
  id: { field: "id" },
  nullable: true,
  findUnique: (id) => ({ id: parseInt(id, 10) }),
  fields: (t) => ({
    name: t.exposeString("name", {
      nullable: true
    }),
    posts: t.relatedConnection("posts", {
      cursor: "id",
      totalCount: true,
    }),
  }),
});
