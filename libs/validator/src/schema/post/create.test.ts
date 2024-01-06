import { createPostSchema } from "./create";

const successAuthorId = Buffer.from("User:1").toString("base64");

describe("正しい値を返した場合エラーにならない", async () => {
  it("authorIdが文字列でもnumberでもエラーにならない", async () => {
    console.log(successAuthorId);

    expect(() =>
      createPostSchema.parse({
        input: {
          title: "title",
          authorId: successAuthorId,
        },
      })
    ).not.toThrow();
  });
});

describe("正しくない値を返した場合エラーになる", async () => {
  it("titleがない場合エラーになる", async () => {
    expect(() =>
      createPostSchema.parse({
        input: {
          authorId: successAuthorId,
        },
      })
    ).toThrow();
  });

  it("authorIdがない場合エラーになる", async () => {
    expect(() =>
      createPostSchema.parse({
        input: {
          title: "title",
        },
      })
    ).toThrow();
  });

  it("titleが文字列でない場合エラーになる", async () => {
    expect(() =>
      createPostSchema.parse({
        input: {
          title: 1,
          authorId: successAuthorId,
        },
      })
    ).toThrow();
  });

  it("authorIdが文字列でない場合エラーになる", async () => {
    expect(() =>
      createPostSchema.parse({
        input: {
          title: "title",
          authorId: true,
        },
      })
    ).toThrow();
  });

  it("authorIdが数値の場合エラーになる", async () => {
    expect(() =>
      createPostSchema.parse({
        input: {
          title: "title",
          authorId: 1,
        },
      })
    ).toThrow();
  });

  it("authorIdのtypenameがUserじゃない場合エラーになる", async () => {
    expect(() =>
      createPostSchema.parse({
        input: {
          title: "title",
          authorId: Buffer.from("Post:1").toString("base64"),
        },
      })
    ).toThrow();
  });
});
