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

we will continue working with the aggregation pipeline and tackle a real business problem. Imagine that we are developing an application for Nature's Company, and they need a function to calculate the busiest month of a given year. This information is crucial for the company to prepare for tours by hiring tour guides, purchasing equipment, and making other necessary arrangements.

To solve this business problem, we can leverage the power of aggregation pipelines in MongoDB. Our goal is to determine how many tours start in each month of the specified year. This is where the aggregation pipeline comes in handy, as it allows us to perform complex data operations and transformations.

Let's start by creating the function for this task. We'll define an asynchronous function called `getMonthlyPlan` Additionally, we need to implement the corresponding route, which will accept the `year` as a URL path parameter.

Once we have the `year` from the request parameters, we can proceed with the aggregation pipeline. We'll define a variable called `plan` which will await the result of the `tour.aggregate()` method.

Before we continue building the pipeline, let's take a look at the complete set of results we want to achieve. By examining the existing tours, we can better understand what our pipeline needs to accomplish. Each tour has an array of start dates, and our objective is to count the number of tours for each month in the given year.

For example, let's consider the year 2021. We have 9 tours in total. One tour starts in April, another in July, and the third in October. The next tour begins in June, followed by one in July and another in August. If we continue analyzing the remaining tours, we can manually tally the number of tours for each month.

However, instead of doing this manually, we can leverage the power of the aggregation pipeline. MongoDB provides a stage called `unwind` which can help us achieve our goal. The unwind stage allows us to transform an array field into multiple documents, each containing one element from the array.

In our case, we want to create a separate document for each start date of the tours. By doing so, we can easily count the number of tours for each month using subsequent pipeline stages.

Let's take a closer look at the code and understand the process step by step.

First, we are setting up a route called `monthly plan` with a specified year. Although there won't be any results initially, we need to define it. The route follows the format `monthly-plan/year` (e.g., "monthly plan/2021").

Next, we send a request to retrieve the result. Previously, we had an array for the start date, but now we only have the first element. By comparing the previous and current results side by side, we can observe that each date now has its own document.

Moving on, we proceed to select the documents for the specified year. This is done using the `match` stage, which is essentially a query to select documents. We search for the year within the `start dates` field. To define the range, we set the date to be greater than or equal to January 1st, 2021, and less than January 1st, 2022.

To achieve this, we create a `new Date` object using the template string with the `year` variable. We compare this newly created date with the date in each document to filter the results.

After testing this stage, we confirm that all the tours displayed are from the year 2021, as intended.

Now, we move on to the `group` stage, where the magic happens. By adding the `group` stage, we can specify how we want to group the documents. In this case, we want to group them by the month. Currently, we have the complete date with the year, month, date, and time. However, we only need the month for our grouping`

To extract the month from the date, we utilize a MongoDB aggregation pipeline operator called `month` This operator returns the month as a number. By using this operator, we can extract the month from the date field.

Once the documents are grouped by month, we want to know the number of tours that start in each month. To achieve this, we use the `sum` operator to add one for each document. This way, we count the number of tours for each month.

We now need to gather additional information about the tours, not just the count. To accomplish this, we'll create an `array` since we want to specify multiple tours within a single field. Each document that goes through the pipeline will have its name field pushed into this array. By doing so, we can easily access the names of the tours. Testing this modification, we can confirm that the names of all three tours are included.

Next, let's add another field that will contain the same value as the ID field. This will allow us to delete the ID later on without losing this valuable information. To achieve this, we'll use the `addFields` stage. This stage is straightforward, as its purpose is to add new fields to the document. In this case, we'll create a field called `month` and assign it the value of the `_id` field.

Now, let's proceed to remove the ID field. We can achieve this using the `project` stage. The `project` stage allows us to specify which fields should appear in the output document. By assigning a value of zero to the ID field, we ensure it no longer appears in the results. If we assigned a value of one, the ID field would be included.

Additionally, let's sort the tours based on the number of tour starts. Although currently the data isn't entirely useful, as we should sort it by the actual number of tour starts, we'll still proceed to showcase the "sort" stage. By specifying the field name "number of tour starts" and using -1, we indicate that we want to sort in descending order, starting with the highest number. As expected, in our case, July is the busiest month with three tour starts: Forest Hiker, Sea Explorer, and Sports Lover.

Lastly, we'll use the "limit" stage, which allows us to restrict the number of output documents. Here, we'll set the limit to six, meaning we'll only display six documents. Although not particularly useful in this scenario, it serves as a reference. To make it more practical, we could set the limit to 12, ensuring we include all twelve months of the year.

Throughout this process, we've introduced several stages with various functionalities, and I understand that it may seem overwhelming to comprehend all of them simultaneously. However, with practice, you'll become more proficient and understand which tools to utilize in different situations. Remember, you can always refer to the comprehensive documentation, which provides excellent learning material alongside this course. This applies to all the technologies we're covering, so I encourage you to explore the documentation to enhance your understanding.

Solving this challenge together has been an enjoyable experience, and I hope you've had as much fun as I have. Problem-solving like this is incredibly satisfying. However, let's not dwell on it any longer. In the upcoming sections, we'll discuss additional exciting features available to us in MongoDB, which promises to be an enjoyable learning experience.
