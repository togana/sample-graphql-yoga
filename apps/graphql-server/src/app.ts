import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { createSchema, createYoga } from "graphql-yoga";

export const buildApp = (logging = true) => {
  const app = fastify({
    logger: logging && {
      transport: {
        target: "pino-pretty",
      },
      level: process.env.NODE_ENV === "development" ? "debug" : "info",
    },
  });

  const graphQLServer = createYoga<{
    req: FastifyRequest;
    reply: FastifyReply;
  }>({
    // TODO: スキーマは別の所で定義できるようにする
    schema: createSchema({
      typeDefs: `
        scalar File

        type Query {
          hello: String
          isFastify: Boolean
        }
        type Mutation {
          hello: String
          getFileName(file: File!): String
        }
        type Subscription {
          countdown(from: Int!, interval: Int): Int!
        }
      `,
      resolvers: {
        Query: {
          hello: () => "world",
          isFastify: (_, __, context) => !!context.req && !!context.reply,
        },
        Mutation: {
          hello: () => "world",
          getFileName: (root, { file }: { file: File }) => file.name,
        },
        Subscription: {
          countdown: {
            async *subscribe(_, { from, interval }) {
              for (let i = from; i >= 0; i--) {
                await new Promise((resolve) =>
                  setTimeout(resolve, interval ?? 1000)
                );
                yield { countdown: i };
              }
            },
          },
        },
      },
    }),
    logging: {
      debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
      info: (...args) => args.forEach((arg) => app.log.info(arg)),
      warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
      error: (...args) => args.forEach((arg) => app.log.error(arg)),
    },
  });

  // ファイルアップロード用のダミーコンテンツタイプパーサー
  app.addContentTypeParser("multipart/form-data", {}, (req, payload, done) =>
    done(null)
  );

  app.route({
    url: graphQLServer.graphqlEndpoint,
    method: ["GET", "POST", "OPTIONS"],
    handler: async (req, reply) => {
      const response = await graphQLServer.handleNodeRequest(req, {
        req,
        reply,
      });
      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      reply.status(response.status);

      reply.send(response.body);

      return reply;
    },
  });

  return {app, endpoint: graphQLServer.graphqlEndpoint} as const;
};
