import SchemaBuilder from "@pothos/core";
import ErrorsPlugin from '@pothos/plugin-errors';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from "@pothos/plugin-relay";
import ValidationPlugin from '@pothos/plugin-validation';
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
  plugins: [ErrorsPlugin, RelayPlugin, PrismaPlugin, ValidationPlugin],
  relayOptions: {
    cursorType: 'ID',
  },
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
    filterConnectionTotalCount: true,
  },
  validationOptions: {
    validationError: (zodError, args, context, info) => {
      return zodError;
    },
  },
  errorOptions: {
    defaultTypes: [],
  },
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver, {});
