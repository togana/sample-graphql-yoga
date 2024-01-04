import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from "@pothos/plugin-relay";
import { DateTimeResolver } from "graphql-scalars";
import { prisma, Prisma } from './db';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [RelayPlugin, PrismaPlugin],
  relayOptions: {
    cursorType: 'ID',
    // TODO: 下記のようにしたら node() での取得解決できるかと思ったがなんだかerrorになる
    // nodeQueryOptions: {
    //   resolve: async (root, { id }, context, info, resolveNode) => {
    //     if (id.typename === 'User') {
    //       return await prisma.user.findUnique({
    //         where: {
    //           id: Number.parseInt(id.id, 10),
    //         },
    //       });
    //     }
        
    //     // fallback to normal loading for everything else
    //     return resolveNode(id);
    //   },
    // },
  },
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
    filterConnectionTotalCount: true,
  },
});

builder.queryType();
// builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver, {});
