## filtering

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

## advanced filtering

In the current implementation, the filter feature is working well, allowing users to filter documents by setting one key equal to a value. However, Our goal is to implement operators such as greater than, greater than or equal to, less than, and less than or equal to.

To begin, we need to understand how the filter object should look in MongoDB. The filter object will have properties like "difficulty" set to "easy" and "duration" with a sub-object indicating the greater than or equal to operator with a value of five. like `{difficulty:'easy', duration: { $gte: 5 }}`

Now, let's explore a standard way of writing a query string with these operators in Postman. We open brackets before the equals sign of five and specify the operator inside. This introduces a third part to the key-value pair, consisting of the key, value, and operator enclosed in brackets. By following this format, we can construct the desired query string.like-

`http://localhost:8000/api/v1/tours?duration[gte]=5&difficulty=easy&page=2&limit=10`

Next, let's examine the query object generated by Express and logged to the console. The main point of interest is that the query object closely resembles the manually written filter object. The only difference is the absence of the MongoDB operator sign, the dollar sign($), preceding the operator name.
`req.query` in console-- `{"duration":{"gte":"5"},"difficulty":"easy"}`

To rectify this, we need to replace the operators in the query string with their corresponding MongoDB operators. We can achieve this by adding the dollar sign before each operator. Let's implement this code and store the modified query string back into the variable.
we now have the desired result with the dollar sign preceding the operators.

for more understanding look at this link [mongo filtering](https://hevodata.com/learn/mongodb-filtering/#t5)

## sorting

Let's proceed with implementing result sorting functionality that will allow users to sort the results based on a specific field.

Suppose we want to sort these results by price, starting from the lowest price and moving up to the highest price. To address this, we need to enable users to sort the results by a field that can be passed via the query string.

To begin, let's consider sorting by price. Running the query `http://localhost:8000/api/v1/tours?sort=price` at this stage will not result in any changes because in the previous lecture, we filtered out the sort field.

However, we now need to make use of it. The third feature we're implementing is sorting.

To check if a sort property exists in the request query, we can `use req.query.sort`. This property will be present in the query object if a sorting request was made. We can now utilize this information.

The updated query will be `query.sort(req.query.sort)`, where `req.query.sort` represents the value of the field we want to sort by, such as `price`. By specifying this value, Mongoose will automatically sort the results based on the given field.

Let's proceed with testing the sorting functionality. Since we have set the sort to `price` we can now observe the results. As expected, the results begin with the lowest price (397) and progressively increase: 497, 997, 1197, 1497, 1997, and 2997. The prices are now sorted in ascending order based on the specified field.

However, we can also sort the results in descending order simply by adding a minus sign `"-"` before the field. For example, setting sort to `-price` will instruct Mongoose to sort the results in descending order based on the price field. Let's test this functionality as well.

Now, the results should start with the highest price and end with the lowest price. By examining the updated results, we can confirm that they are indeed sorted as expected.

Taking it a step further, let's consider the scenario where multiple results share the same price. In such cases, it becomes relevant to understand the ordering of these results. For instance, if we have two results with the same price, why does one appear before the other? It's important to analyze how results with identical prices are sorted within themselves.

While reviewing the results, we can identify instances where multiple results share the same price.

in some cases, we may have multiple documents with the same price. In these scenarios, it becomes necessary to define a secondary criteria to determine the order within these tied results. For instance, if we have two documents with the same price, we might want to sort them based on their `ratingsAverage` field.

In Mongoose, implementing such sorting is quite easy. We can extend the sorting functionality by adding additional fields to the sorting parameter.
`sort(price ratingsAverage)`
By separating the field names with a comma, we can specify multiple fields for sorting. Mongoose will prioritize the first field and, in the case of a tie, use the subsequent fields to further refine the order. This flexibility allows us to define complex sorting rules based on multiple criteria.

now URL would be `http://localhost:8000/api/v1/tours?sort=-price,ratingsAverage`

To implement this in our code, we first split the sorting parameter provided in the URL query string by the comma. This gives us an array of field names. Next, we join these field names using a space as the separator, creating a string that represents our desired sorting criteria. This string is then passed as the sorting parameter in our Mongoose query.

## fields limiting

Field limiting allows clients to choose which specific fields they want to receive in the response. This feature is particularly useful when dealing with large datasets where minimizing the amount of data transferred over the network is essential.

To demonstrate field limiting, let's use Postman. We'll specify a field called "fields" in our request and provide a comma-separated list of the fields we want to receive in the response, such as name, duration, difficulty, and price.like `http://localhost:8000/api/v1/tours?fields=name,duration,difficulty,price`

Implementing field limiting is similar to the sorting feature we previously explored. If the request includes the `fields` query parameter, we create a variable for the selected fields. MongoDB expects a string with field names separated by spaces, so we construct the appropriate string by splitting the `fields` parameter by commas and joining them with spaces.

The next step is to modify the query by using the `select` method. By passing the constructed string of field names, we instruct MongoDB to select only those fields and exclude the others. This operation is referred to as `projecting`.

To provide a default behavior when the client doesn't specify any fields, we remove the `__v` field, which is automatically generated by MongoDB. We prefix it with a minus sign `-__v` to exclude it from the response. In this way, we only include the requested fields while excluding `__v`.

Testing the implementation in Postman confirms that the response contains only the selected fields. We can even use the minus sign to exclude specific fields while including all others.

Additionally, field exclusion can be enforced directly in the `Schema`. This can be useful for hiding sensitive data that should not be exposed to clients. For instance, if we want to hide the `createdAt` field in the Schema, we can set the `select` property to `false` in the `tourSchema`. Now, when retrieving the results, the `createdAt` field will be omitted from the response, effectively hiding it permanently.

## pagination

Pagination is an essential feature for a well-designed API. It allows users to select specific pages of results when dealing with large datasets.

To implement pagination using a query string, we can use the `page` and `limit` fields. The `page` field indicates the desired page number, while the `limit` field specifies the number of results per page. For instance, if we want to retrieve page 2 with a limit of 10 results, the query string would include `page=2&limit=10`.

To begin, let's construct an example query. We can utilize the `skip()` and `limit()` methods provided by Mongoose. The `limit` method specifies the number of results we want in the query, which matches the limit defined in the query string. The `skip` method determines the number of results to skip before querying the data.

Considering the query string example where the user requests page number 2 with a limit of 10 results per page, the results for page 1 would be from 1 to 10, while the results for page 2 would be from 11 to 20. To retrieve the correct results for page 2, we need to skip 10 results before querying, starting from result number 11.

To calculate the value for the `skip` parameter, we need to consider both the page and limit values. However, Therefore, we need a way to calculate the skip value based on the page and limit.

Before diving into the skip calculation, it's important to extract the page and limit values from the query string and define default values. Even if the user doesn't specify a page or limit, we still want to provide pagination functionality. By setting default values (e.g., page number 1 and a limit of 100), users will receive a subset of results, such as 100 records, instead of overwhelming them with the entire dataset.

In the code, we are retrieving the value of the page from the request query using `request.query.page`. By multiplying it by 1, we convert it from a string to a Number. This is necessary because query parameters are typically received as strings. To ensure consistency, we convert it to a number.

By default, if no page number is specified, we set it to 1.

The objective is to calculate the `skip` value, which determines the number of results to skip before fetching the desired page. To illustrate this, let's consider an example. Suppose we are requesting page number 3 with a limit of 10 results per page. In this case, the results on page three would be from 21 to 30. To start at result number 21, we need to skip 20 results, which is equal to 2 times the limit.

Based on this observation, we derive a formula: `(page - 1) * limit`. In our example

To implement this formula in code, we replace the values with the variables skip and limit. The skip value represents the number of results to skip before the requested page, while limit represents the number of results per page.

We can now test this implementation on postman.
On the page 3 with limit 3, we obtain `The Northern Lights`, `The Wine Taster` and `The Star Gazer` Finally, when we attempt to access page number 4, we receive zero results, as expected, since there are not enough tours to have 4 pages with 3 results each.

To enhance the user experience, we can handle cases where the requested page does not exist. In such situations, we can throw an error to indicate that the page is out of range. This way, the user is informed when attempting to access a non-existent page.

to implement this --> if `request.query.page` is present, we'll proceed with testing if we are attempting to skip more tours than we actually have. To determine the number of tours, we'll use a new method called `countDocuments()` on the Tour model. This method returns a promise, so we'll await its result to obtain the total count of tours.

If the number of documents we're attempting to skip is greater than the total number of tours, it means that the requested page does not exist. In this case, we'll throw a new error with the message `This page does not exist` Throwing an error in this context will immediately move to the catch block, which will handle the error and send a 404 fail message.

we've explored querying data with Mongoose, and the methods we've used are not limited to the specific features we've implemented. These techniques can be applied to various types of queries in different applications. Although we've demonstrated their usage in the context of building API features, you'll be able to utilize them in your future projects as well.
