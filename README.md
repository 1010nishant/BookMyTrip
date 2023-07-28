## error handling

Let's discuss how to handle undefined routes in our application using Express. Before we dive into error handling, we need to address the issue of routes that don't have any assigned handlers. To begin, let's ensure that our application is running

For example, let's consider the URL `api/tours` instead of the expected `api/v1/tours`. In this case, Express will automatically respond with `HTML code and a 404 Not Found error` because there is no handler defined for the requested route. Similarly, if we misspell a route, such as tour instead of tours, the same error response will be returned.

Another scenario arises when we include additional parameters after the tours route, like api/tours/something. In this case, an error related to the conversion of the parameter to a valid MongoDB object ID may occur. However, for the purpose of this discussion, let's focus on the previous situation, where we receive an HTML error response.

Since we are building an API, it doesn't make sense to send back HTML as a response. Therefore, we need to create a handler function to manage routes that are not caught by our defined routers. Let's navigate to the `app.js` file in our application.

To handle routes that are not captured by any of the defined routers, we can add a middleware function after these routers in the code. Since middleware functions are executed in the order they appear, if a request reaches this point, it means it hasn't been handled by the `tourRouter` or `userRouter`. We can create a route handler using `app.all` instead of specifying a particular HTTP method like `get, post, delete, or patch`. This allows us to handle all routes and HTTP methods in a single handler.

To implement this, we use `app.all('*', (req, res, next) => { ... })`. The asterisk `(*)` acts as a wildcard, matching any route that hasn't been handled before. Inside the handler, we want to send a `JSON response instead of HTML`. We can achieve this by using `res.status(404).json({ status: 'fail', message: Can't find ${req.originalUrl} })`. The req.originalUrl property holds the URL that was requested.

But why does this approach work? The key lies in understanding the request-response cycle and how middleware is added to the middleware stack. Middleware is added in the order it is defined in our code. In this case, the code we are examining runs first. If the route was matched earlier in our `tourRouter`, the request would never reach this point, and the subsequent code would not be executed. Therefore, it is crucial to place this code as the final part, after all other routes have been defined and processed.

To demonstrate this, let's imagine we move this code to the top of our application. In doing so, regardless of the request we make, we will always receive the same response.

![](/tut-img/errorhandlingoverview.png)

In the course thus far, we have not effectively handled errors in a centralized manner within our application. Previously, when something went wrong, we would simply send back an error message as JSON in each route handler. In this section, we will address this issue and improve our error handling approach.

Before diving into the implementation details, let's take a moment to gain a high-level understanding of error handling in Express. We can categorize errors into two types: `operational errors and programming errors`.

Operational errors are foreseeable issues that can occur at some point in the future. They are not bugs in our code but rather depend on factors such as user actions, the system, or the network. Examples of operational errors include a user accessing an invalid route, providing invalid input data, or the application failing to connect to the database. It is essential to handle these errors proactively to prepare our application for such scenarios. While some people distinguish between errors and exceptions conceptually, we will use the term "errors" interchangeably with "exceptions" in this course to avoid confusion.

On the other hand, programming errors are bugs introduced by developers in the code. These errors arise from mistakes like attempting to access properties from an undefined variable, using "await" without an "async" function, or accidentally using "request.query" instead of "request.body." Programming errors are inevitable but more challenging to identify and handle effectively.

When discussing error handling with Express, we primarily focus on operational errors since they are easier to catch and handle within our Express application. Express provides built-in error handling capabilities. We need to create a global Express error handling middleware, which will catch errors from various parts of the application. Whether the error originates from a route handler, a model validator, or elsewhere, the goal is to funnel all these errors into a centralized error handling middleware. This way, we can send a clear response to the client, informing them about the error that occurred.

It's important to note that error handling can involve different actions depending on the situation. In some cases, handling means sending a response to inform the user about the error. However, it can also involve retrying the operation, crashing the server, or even ignoring the error altogether if that is the most appropriate course of action.

The advantage of having a global error handling middleware in Express is that it enables a clear separation of concerns. We no longer need to worry about error handling in our business logic, controllers, or any other part of the application. Instead, we can pass the errors down to the error handler, which will then determine the next steps to take based on the error received.

With this understanding, we can now proceed to implement the improved error handling approach in our application.
