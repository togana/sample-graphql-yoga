import { ZodError, type ZodFormattedError } from "zod";
import { builder } from "../builder";

const flattenErrors = (
  error: ZodFormattedError<unknown>,
  path: string[]
): Array<{ path: string[]; message: string }> => {
  const errors = error._errors.map((message) => ({
    path,
    message,
  }));

  Object.keys(error)
    .filter((key) => key !== "_errors")
    .forEach((key) => {
      errors.push(
        ...flattenErrors(
          // HACK: 型推論うまくできないが ZodFormattedError の構造的にはあっている
          (error as Record<string, unknown>)[key] as ZodFormattedError<unknown>,
          [...path, key]
        )
      );
    });

  return errors;
};

const ErrorInterface = builder.interfaceRef<Error>("Error").implement({
  fields: (t) => ({
    message: t.exposeString("message"),
  }),
});

const ZodFieldError = builder
  .objectRef<{
    message: string;
    path: string[];
  }>("ZodFieldError")
  .implement({
    fields: (t) => ({
      message: t.exposeString("message"),
      path: t.exposeStringList("path"),
    }),
  });

builder.objectType(ZodError, {
  name: "ZodError",
  interfaces: [ErrorInterface],
  fields: (t) => ({
    fieldErrors: t.field({
      type: [ZodFieldError],
      resolve: (err) => flattenErrors(err.format(), []),
    }),
  }),
});
