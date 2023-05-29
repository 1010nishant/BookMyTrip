Let's dive deeper into working on our API and implementing features that enhance its usability. we'll start with filtering, which allows users to narrow down the data they receive by utilizing a `query string`.
Filtering makes the most sense in the "get all tours" route, which, as the name suggests, retrieves all tours. We want to enable users to filter the data, so instead of receiving all tours, they can specify criteria and obtain only the matching results.

The query string structure consists of a question mark followed by field-value pairs. For instance, to filter for tours with a duration of five and a difficulty level of easy, we construct a query string like this: `?duration=5&difficulty=easy`. Postman automatically recognizes and parses the query string, displaying the key-value pairs in the Params tab.

Now, we need to access this data within our Express application. Thankfully, Express simplifies this process by providing a built-in solution. The data from the query string can be accessed through the request object, specifically the "query" field. By accessing `req.query` we retrieve an object containing the parsed data from the query string.

let's discuss two different methods of writing database queries in Mongoose.

The first method involves using a filter object, as we have previously seen in the MongoDB introduction section. We utilize the `find()` method and pass a filter object as a parameter. This method works similarly to a regular MongoDB query. For example, we can specify `duration: 5` and `difficulty: easy` to create a filter object that matches our previous query string.
just like:

```js
const tours = await Tour.find({
  duration: 5,
  difficulty: "easy",
});
```

The second method employs special Mongoose methods that allow us to construct queries more dynamically. We start similarly with the "find" method, but then we chain additional methods to build the query. Using the `where` method, we can specify individual conditions. For instance, we can chain `where('duration').equals(5)` and `where('difficulty').equals('easy')` to recreate the same query as before. This method offers flexibility with various operators and additional functionalities like sorting and limiting results.
just like:

```js
const tours = await Tour.find()
  .where("duration")
  .equals(5)
  .where("difficulty")
  .equals("easy");
```

For the sake of simplicity and consistency, we choose to utilize the `req.query` object to implement filtering. Remarkably, this object already resembles the filter object structure we discussed. By directly passing `req.query` to our Mongoose query, we achieve the same filtering results as before.

However, this implementation is overly simplistic. In the future, we will introduce additional query parameters like sorting and pagination. We need to ensure that these parameters are not included in our database query. For example, if we were to add `page=2` to our query, we would receive no results because there are no documents with the page field set to 2. We want to use the page field for implementing pagination, not as a filter criterion.

To address this issue, we need to exclude these special field names from our query string before applying the filter. Here's how we'll implement it:

First, we'll create a shallow copy of the `req.query` object and call it `queryObject`. It's essential to create a hard copy, not just a reference to the original object.

To create a hard copy in JavaScript, we can utilize ES6 destructuring by using the spread operator (...) and then creating a new object. This way, we obtain a new object containing all the key-value pairs from the `req.query` object.

Next, we'll create an array called `excludedFields` that includes all the fields we want to exclude from the query. In this case, we want to exclude page, sort, limit, and fields.

We'll iterate over the `excludedFields` array using the `forEach` method. For each element, we'll use the `delete` operator to remove the corresponding field from the `queryObject`.

Finally, we'll log both `req.query` and `queryObject` to ensure that our logic functions as expected.

By examining the logs, we can confirm that our `queryObject` only contains the difficulty field, while the original `req.query` retains all the fields. This means that instead of using `req.query`, we'll now use `queryObject` for our filtering.

Additionally, we need to understand how queries work in Mongoose. The `find` method returns a query object, which allows us to chain other methods such as `where, equals`, and more.
However, when we `await` the query's result, the query is executed and returns the matching documents. If we immediately `await` the query as we did previously, we won't be able to implement sorting, pagination, or other features. Instead, we need to save the initial query without awaiting it and then chain the necessary methods to the query. Only at the end should we `await` the final query.

To implement this, we'll modify our code structure. We'll build the query first and then execute it by awaiting the query itself. By separating the query construction and execution, we enable the incorporation of additional features in the future.
