# Aggregation Intro

the MongoDB aggregation pipeline, a highly powerful and useful framework for data aggregation in MongoDB. The aggregation pipeline allows us to define a sequence of operations that documents from a specific collection will go through, transforming them into aggregated results step by step. It's a fantastic tool for performing various calculations, such as averages, minimum and maximum values, and even distance calculations. The capabilities of the aggregation pipeline are truly remarkable.

Now, let's dive into using the aggregation pipeline. First, I'll create a new function called `getTourStats` This function will calculate several statistics about our tours.

The aggregation pipeline is a MongoDB feature, and we can access it through Mongoose, the MongoDB driver for Node.js. With Mongoose, we can utilize the aggregation pipeline by calling `tour.aggregate()` on our tour model, which represents the tour collection. Similar to regular queries, the aggregation pipeline consists of multiple stages. We define these stages in an array passed as an argument to `aggregate()`.

Each stage represents a specific transformation step that the documents will undergo in the defined sequence. As the documents move through the pipeline, they pass through each stage one by one. However, before we proceed, let's take a moment to explore the MongoDB documentation.

The MongoDB website provides extensive documentation, offering a wealth of information. The MongoDB Manual is a comprehensive resource covering a wide range of topics.
If you ever need to find operators beyond the ones we've covered. this [link](https://www.mongodb.com/docs/manual/aggregation/) will help.

In this lecture, we'll primarily focus on the `match` and `group` stages of the aggregation pipeline, as they are crucial for our current purposes. Remember that if you need to explore other stages or features, the documentation is readily available for your reference.

Let's dive into the process of defining stages in MongoDB's aggregation pipeline. We'll start with the `match` stage, which is used to select or filter specific documents. It functions similarly to a `filter` object in MongoDB, allowing us to narrow down our results. Each stage is represented as an object, and the match stage focuses on querying the data.

For example, suppose we want to select documents with an average rating greater than or equal to 4.5. To accomplish this, we simply define the match stage with the appropriate condition. In this case, we specify that the `ratingsAverage` field should be greater than or equal to `$gte: 4.5`.

The `match` stage serves as a preliminary step in preparing the data for subsequent stages in the pipeline. The next stage we'll explore is the `group` stage. Like the match stage, the group stage is represented as an `object` within the aggregation pipeline.

The group stage is where the real magic happens, as it allows us to group documents together using `accumulators`. Accumulators perform various calculations on grouped data, such as calculating averages. For example, if we have five tours, each with a rating, we can use the group stage to calculate the average rating for all the tours.

To specify what we want to `group by`, we need to provide an `identifier`. In this case, we set the identifier to `null`, indicating that we want to group all the documents together. However, later on, we can group by different fields, such as difficulty, to calculate averages for specific subsets of tours (e.g., easy, medium, difficult).

Within the group stage, we can define the fields we want to calculate. For instance, we can calculate the average rating by using the MongoDB operator for averaging `($avg)` and specifying the field name as `ratings average` Similarly, we can calculate the average price, minimum price, and maximum price using the appropriate operators.

Once we've defined the stages in the aggregation pipeline, we need to send the response with the data. We can accomplish this by adding a new route in our tour routes,

Great! Now that we have calculated the average rating and the price range for our tours, we can verify that the data supports these values. It's really exciting to see everything coming together!

There's one more thing I want to do here. I'd like to determine the total number of ratings we have and also the total number of tours in our dataset. Let's work on that.

To calculate the total number of ratings, we'll use the `sum` operator and target the `ratingsQuantity` field. It's intuitive to assume that the number of ratings is stored there, and by summing up all the values in that field, we can get the total count of ratings.

Similarly, let's calculate the total number of tours. This one is a bit trickier, but I'll guide you through it. We'll still use the sum operator, but this time, we'll add 1 for each document. This means that for every document that passes through this pipeline, we'll increment the `numTours` counter by 1. This way, we can obtain the total count of tours.

These statistics provide us with valuable insights into all our tours collectively.

But now, let's take it a step further. As mentioned earlier, we can group our results based on different fields. Let's start by grouping them by `difficulty`. This process is quite similar to specifying the fields we want to include in our results.

The first step is to specify the `difficulty` field by using the MongoDB operator `$difficulty`. This allows us to define statistics for each difficulty level. By utilizing this pipeline, we can perform various data manipulations and gain valuable insights.

The aggregation pipeline provides us with the opportunity to uncover meaningful insights from our data.

The pipeline also allows us to perform operations on the data. As an example, we can transform the `difficulty` field to uppercase by using the `$toUpper` operator. This demonstrates the flexibility and power of the aggregation pipeline.

Moving forward, we can introduce the `sort` stage to organize the data based on specific fields. We can specify `avgPrice` as the field to sort by. It's important to note that we must use the field names specified in the `group` or just previous stage stage because the original field names are no longer accessible at this point. By sorting in ascending order (1), we can observe the lowest and highest average prices among the tours.

The aggregation pipeline also supports repeating stages. We can include another `$match` stage to demonstrate this capability and introduce a new operator. In this case, we select documents where the `_id` (now representing the difficulty) is not equal to(`$ne`) `easy`. This effectively excludes the tour with the `easy` difficulty level, leaving only the `medium` and `difficult` tours.

Although this specific example may not provide substantial value due to the exclusion of relevant data, it highlights the possibility of including multiple match stages within the pipeline.
