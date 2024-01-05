import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from "@pothos/plugin-relay";
import WithInputPlugin from "@pothos/plugin-with-input";
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
  plugins: [RelayPlugin, PrismaPlugin, WithInputPlugin],
  relayOptions: {
    cursorType: 'ID',
  },
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
    filterConnectionTotalCount: true,
  },
  withInput: {
    argOptions: {
      // 明示的に required: true を指定して基本的に prismaFieldWithInput を利用した場合必須にする
      // ただし、prismaFieldWithInput で 不要な場合は argOptions の required: false を指定することで必須じゃなくできる
      required: true,
    },
  },
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver, {});
