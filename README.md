# Lecture 8
API restructure, `mongodb` npm package and mongo collection `insertOne` and `find` methods.

## Overview
We divided our api into 2 separate `express` routers that handle `/people-json` and `/people-mongo` requests. We then created `Person` class with some validation and default fields. We used this class to create objects that we store in mongo `people` collection. We also decided to use `mongodb` package instead of `mnogoose`.

## Material
- [`monogodb` package](https://www.npmjs.com/package/mongodb)
- [`express` router](https://expressjs.com/en/api.html#router)
- [collection `insertOne` method](https://docs.mongodb.com/realm/mongodb/actions/collection.insertOne/)
- [collection `find` method](https://docs.mongodb.com/realm/mongodb/actions/collection.find/)
