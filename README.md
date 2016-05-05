# Sails models -> GraphQL schema
This module will help you to create GraphQL schema of each model in your Sails application.
It uses Waterline configuration files for creating GraphQL objects and `sails.request()` method for performing internal requests and resolving queries/mutations.

## Quick example
Assume you have two models: Author and Article
```javascript
/**
 * api/models/Author.js
 */
module.exports = {
  attributes: {
    name: {
      type: 'string'
    },
    articles: {
      collection: 'article',
      via: 'author'
    }
  }
};

/**
 * api/models/Article.js
 */
module.exports = {
  attributes: {
    name: {
      type: 'string'
    },
    slug: {
      type: 'string',
      unique: true
    },
    author: {
      model: 'author'
    }
  }
};
```

Then `sails-graphql` will generate you the following schema:

```javascript
import { generateSchema } from 'sails-graphql';
import { printSchema } from 'graphql';

// expected that sails is defined globally
const schema = generateSchema(sails.models);
console.log(printSchema(schema));

/**
 * Prints out:
 *
 * schema {
 *   query: RootQueryType
 *   mutation: RootMutationType
 * }
 *
 * type ArticleConnectionType {
 *   page: Int
 *   pages: Int
 *   perPage: Int
 *   total: Int
 *   edges: [ArticleType]
 * }
 *
 * input ArticleInputType {
 *   name: String
 *   slug: String
 *   author: AuthorInputType
 *   id: String
 *   createdAt: String
 *   updatedAt: String
 * }
 *
 * type ArticleType {
 *   name: String
 *   slug: String
 *   author: AuthorType
 *   id: String
 *   createdAt: String
 *   updatedAt: String
 * }
 *
 * type AuthorArticlesConnectionType {
 *   page: Int
 *   pages: Int
 *   perPage: Int
 *   total: Int
 *   edges: [ArticleType]
 * }
 *
 * type AuthorConnectionType {
 *   page: Int
 *   pages: Int
 *   perPage: Int
 *   total: Int
 *   edges: [AuthorType]
 * }
 *
 * input AuthorInputType {
 *   name: String
 *   articles: [ArticleInputType]
 *   id: String
 *   createdAt: String
 *   updatedAt: String
 * }
 *
 * type AuthorType {
 *   name: String
 *   articles(where: String, limit: Int, skip: Int, sort: String): AuthorArticlesConnectionType
 *   id: String
 *   createdAt: String
 *   updatedAt: String
 * }
 *
 * type RootMutationType {
 *   createArticle(article: ArticleInputType!): ArticleType
 *   deleteArticle(id: String!): ArticleType
 *   updateArticle(id: String!, article: ArticleInputType!): ArticleType
 *   createAuthor(author: AuthorInputType!): AuthorType
 *   deleteAuthor(id: String!): AuthorType
 *   updateAuthor(id: String!, author: AuthorInputType!): AuthorType
 * }
 *
 * type RootQueryType {
 *   article(slug: String, id: String): ArticleType
 *   articles(where: String, limit: Int, skip: Int, sort: String): ArticleConnectionType
 *   author(id: String): AuthorType
 *   authors(where: String, limit: Int, skip: Int, sort: String): AuthorConnectionType
 * }
 *
 */

```

## Usage
1. Make sure you have `sails` and `graphql` installed
2. Create a GraphQLController
```javascript
/**
 * api/controllers/GraphQLController.js
 */
import { graphql } from 'graphql';
import { generateSchema } from 'sails-graphql';

let schema = null;

module.exports = {
  index(req, res) { // default index action

    if (!schema) {
      schema = generateSchema(sails.models);
    }

    graphql(
      schema,                       // generated schema
      req.body,                     // graphql query string
      null,                         // default rootValue
      {                             // context
        request: sails.request,     // default request method - required
        reqData: {                  // object of any data you want to forward to server's internal request
          headers: {/*your headers to forward */}
        }
      }
    ).then((result) => {
      // errors handling
      res.json(result.data);
    });
  }
};

```
Try to `POST` some query to `/graphql`. That's it!


## License
The MIT License (MIT)

Copyright (c) 2016 zhukmj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
