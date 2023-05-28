## Create Tour

In this lecture, we will explore a more efficient and improved way to create documents in the database as we implement our create tour handler.

To begin, we will implement the `createTour` function, which is the handler function called when there is a POST request to the tours route. Previously, we had a `checkBody` function to validate the body, However, with the introduction of Mongoose models, this validation can be handled by the model itself so we can remove it.

Instead of manually creating a new document using `newTour = new Tour(data)` and then saving it with `newTour.save()`, we can use a simpler approach. By utilizing the `create` method provided by the Tour model, we can pass the data directly. This achieves the same result as before, but the main difference is that in the first version, we called the method on the new document, whereas in the second version, we call it directly on the model.

we can leverage `async/await` for more readable and concise code. By marking the function as `async`, we can use await to wait for the promise returned by `Tour.create` to resolve, and the resulting document will be stored in the `newTour` variable.

To pass real data to the create method, instead of using an empty object, we can use req.body, which represents the data received in the POST request. So, the data from the request body is directly stored in the database using the create method of the Tour model. The method returns a promise, which we can then await to obtain the newly created document with its assigned ID.

While this implementation is more concise and readable, we need to handle errors. With `async/await`, error handling is done using the `try/catch` syntax. We wrap our code in the `try` block and `catch` any potential errors in the catch block.

we have created a tour using Mongoose. The tour object has properties such as rating, name, price, and an automatically generated ID. However, two fields, difficulty and price, are missing from the schema and are therefore not included in the database. Mongoose only considers the fields defined in the schema and ignores any additional properties.

## read tours and tour by ID

Let's start with the `getAllTours` handler. To retrieve all the tours from the database, we will utilize the Tour model. So, we use the `find` method on the Tour model. This is similar to what we learned in the MongoDB section, where we used find to query for all documents.

When we pass nothing into the find method, as we're doing here, it returns all the documents in the collection, specifically the tour collection in our case.

The find method takes care of converting the returned documents into JavaScript objects.

Moving on, let's implement the `getTour` handler. To obtain the tour ID, we need to look at the route. In this case, the request will contain the ID parameter in the route. By accessing `req.params.id`, we can retrieve that ID within the handler. We'll save it into the "tour" variable.

## Updating tours

Now,in `updateTour`, within the try block, our first task is to query for the specific document we want to update. Thankfully, with the help of Mongoose, we can combine the querying and updating steps into a single command. Similar to finding a document by ID, we can utilize the `findByIdAndUpdate`method. Let's write `Tour.findByIdAndUpdate` and pass in the `ID` of the document we want to update as `req.params.ID`. The data we want to change is available in the request body, `req.body`. Additionally, we can provide a third argument, an `options object`. In this case, we want to set the new option to true to ensure that the updated document is returned.

Awaiting the result of this query, let's assign it to a new variable called tour to represent the updated document. It's important to note that all the methods we have used so far on the tour object, such as findById and update, return queries. These query methods can be explored in the Mongoose documentation, which provides details on their usage.

One important option to consider is `runValidators`. By setting this option to true, the validators specified in the schema will run each time a document is updated.

In the doc. of Node, You might have noticed the line `model.prototype.save`. We have actually encountered this line before when we first started working with Mongoose. In JavaScript, `model.prototype` refers to an object created from a class or, in this case, a model. Therefore, the `save`method here pertains to saving a document, not a tour itself.

To illustrate, let's refer back to the code where we created a new tour object from the tour model. In that example, we had a variable named `newTour`, which was an instance of the tour model. Consequently, this `newTour` object had access to the save method since it is part of the prototype object of the class.
Understanding the fundamentals of JavaScript is crucial to comprehending the documentation effectively.

When encountering `model.prototype` in the code, it indicates that the save method will be available to all instances created through a model, rather than the model itself. For instance, if you attempted to use `tour.save`, you would encounter an error. However, if you used save on a document created through the tour model, it would work flawlessly.

Keep in mind that we are performing a patch request here. In contrast, if we were to use a put request, the original object would be entirely replaced by the new one

## delete a tour

look at the code
