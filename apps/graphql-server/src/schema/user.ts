import { decodeGlobalID } from "@pothos/plugin-relay";
import { builder } from "../builder";

builder.prismaNode("User", {
  id: { field: "id" },
  findUnique: (id) => {
    const { id: rawID } = decodeGlobalID(id);
    return { id: Number.parseInt(rawID, 10) };
  },
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
