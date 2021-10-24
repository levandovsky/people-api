# Lecture 5
In this lecture we added a post form to our client, refactored and added additional functionality to our api.

## Refactored:
- `Readline` class to use correct path to save `people.json` file
- Send added person with success response

## Added:
- `morgan` - log calls in the server console
- `nodemon` - restart server after file changes 
-  dynamic `get` route by `name` - get all people by `name` param
-  dynamic `get` route by `timestamp` - get one person by `timestamp` param

## Material
- [morgan](https://www.npmjs.com/package/morgan)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [`express` dynamic routes](http://expressjs.com/en/guide/routing.html#route-parameters)
