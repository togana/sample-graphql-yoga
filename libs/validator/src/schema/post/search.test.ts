import { searchPostSchema } from "./search";

describe("正しい値を返した場合エラーにならない", async () => {
  it("titleが文字列の場合エラーにならない", async () => {
    expect(() =>
      searchPostSchema.parse({
        title: "title",
      })
    ).not.toThrow();
  });

  it("titleがない場合エラーにならない", async () => {
    expect(() => searchPostSchema.parse({})).not.toThrow();
  });
});

describe("正しくない値を返した場合エラーになる", async () => {
  it("titleが文字列でない場合エラーになる", async () => {
    expect(() =>
      searchPostSchema.parse({
        title: 1,
      })
    ).toThrow();
  });
});
