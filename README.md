# sample-graphql-yoga

## 環境構築

package install

```
$ pnpm install
```

workspace の package ビルド

```
$ pnpm validator build
```

prisma client をいい感じに生成する

```
$ pnpm graphql-server generate:prisma
```

マイグレーション実行するとDBも生成される(ついでに30000ユーザ生成される)

```
$ pnpm graphql-server migrate:prisma
```

## 実行

```
$ pnpm graphql-server dev
```

## クエリ例

挙動確認には下記を利用している

https://altairgraphql.dev/

### 複数 post 取得

1000件取得

```
{
  posts(first: 1000) {
    totalCount
    edges {
      cursor
      node {
        id
        title
        author {
          name
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
```

cursor ページネーションの挙動

```
{
  posts(first: 1000, after: "R1BDOk46MTAw") {
    totalCount
    edges {
      cursor
      node {
        id
        title
        author {
          name
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
```

### 単一 post 取得

```
{
  post(id: "UG9zdDoz") {
    author {
      id
      name
      posts(first: 10) {
        totalCount
        edges {
          cursor
          node {
            id
            title
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
    id
    title
  }
}
```

### node による取得

user の ID: 1 を指定

```
{
  node(id: "VXNlcjox") {
    id
    __typename
    ... on User {
      name
    }
    ... on Post {
      title
    }
  }
}
```

post の ID: 1 を指定

```
{
  node(id: "UG9zdDox") {
    id
    __typename
    ... on User {
      name
    }
    ... on Post {
      title
    }
  }
}
```

### nodes による取得

user と post が混じっている

```
{
  nodes(ids: ["VXNlcjox", "UG9zdDox"]) {
    id
    __typename
    ... on User {
      name
    }
    ... on Post {
      title
    }
  }
}
```
