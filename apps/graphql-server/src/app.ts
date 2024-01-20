import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { createYoga } from "graphql-yoga";
import { useSofa } from '@graphql-yoga/plugin-sofa'
import { schema } from "./schema"

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
    schema,
    logging: {
      debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
      info: (...args) => args.forEach((arg) => app.log.info(arg)),
      warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
      error: (...args) => args.forEach((arg) => app.log.error(arg)),
    },
    plugins: [
      useSofa({
        basePath: '/rest',
        depthLimit: 2,
        swaggerUI: {
          endpoint: '/swagger'
        },
        // 定義ファイルの出力先
        openAPI: {
          endpoint: '/openapi'
        },
      })
    ]
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

  app.route({
    url: "/rest/*",
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
