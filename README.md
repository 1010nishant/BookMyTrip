## protected routes

In our authentication implementation, we have successfully logged in users with correct passwords, which marks the completion of the first step in the authentication workflow. This step involves creating a JSON web token (JWT) and sending it back to the client when the user provides a correct email and password.

Now, we will proceed to implement protected routes, which is the second step of authentication. This involves using the created JWT to grant access to logged-in users for protected routes. To illustrate this, let's consider the example of protecting the `getAllTours` route, which should only be accessible to logged-in users who need to retrieve a list of all available tours.

To protect this route, we need to verify if the user is logged in before executing the `getAllTours` handler. This can be accomplished using a middleware function, which will run before the handler. The middleware will either return an error if the user is not authenticated or call the next middleware (in this case, the `getAllTours` handler) if the user is authenticated. This effectively prevents unauthorized access to the protected route.

To implement this, we will create a middleware function called `protect` in the authentication controller. This function will be an async function, just like the other functions in the controller.

Firstly, we need to get the token and check if it exists. This involves checking the request `headers` for the token. We will handle this by sending the token in an HTTP header using Postman and accessing the headers in Express.

Once we have the token and verify its existence, the next step is to validate the token. This crucial step involves the JWT algorithm verifying if the token's signature is valid. Additionally, if the verification is successful, we need to check if the user attempting to access the route still exists. Finally, we also need to check if the user changed their password after the token was issued.

Only if all of these steps pass without any issues, the next middleware (the protected route handler) will be called, granting access to the protected route. In our example, this corresponds to the `getAllTours` handler.

Let's delve into the details of working with HTTP headers in Express. HTTP headers are an essential part of the request sent by a client to a server. In Postman, we can explore these headers and set custom ones to better understand how to access them in Express.

In Express, we can access the request headers, which are sent by the client, by examining the `req.headers` object. When we make a request in Postman and set a custom header, such as `test` with a value of `home` Express provides us with an object containing all the headers sent with the request.

Postman automatically includes certain headers in requests, such as `user-agent` and `host` However, what concerns us here is the custom header we set, `test` with the value `jonas` To send a JSON web token (JWT) as a header, it is standard practice to use the `authorization` header with a value starting with `Bearer` followed by the token itself.

When working with headers in Express, it's important to note that Express automatically converts all header names to lowercase. However, the header value remains unchanged. In our case, the header value contains the token we want to extract and verify.

To extract the token from the header, we need to check if the `req.headers.authorization` exists and if it starts with the `Bearer` string. If both conditions are met, we can assign the token to a variable. We `split` the authorization header value using the space`' '` character and retrieve the second element of the resulting array, which corresponds to the token.

In the case where no token is provided, we send a response to the user indicating that they are not logged in and need to log in to gain access. The appropriate status code for this situation is `401`, which stands for `unauthorized`

By testing the protected route without including the authorization header, we verify that the error message is correctly displayed, indicating that the user is not logged in.

Currently, our middleware ensures that the token is required for accessing protected routes. However, it is not enough to merely include a token; we also need to verify its validity. This involves ensuring that the token's payload, in our case, the `user_id`, has not been tampered with. We will explore the implementation of this verification step in the next video, as there are still several important concepts to cover in this lecture.

Let's continue developing our `protect` middleware function. previously we retrieved the token from the authorization header and checked its existence. Now, we move on to the verification step for the token. This step involves checking if the data has been manipulated or if the token has expired.

To accomplish this, we utilize the `verify` function from the JSON Web Token package, just like we used the assign function before. We pass the token to `jwt.verify`, which reads the payload and requires the secret to create a test signature. In our case, the secret is retrieved from `process.env.JWT_SECRET`.

The `verify function` requires a callback function as its third argument. This function is executed once the verification process is complete. Since `verify` is an asynchronous function, we want to maintain the pattern of using `promises and async/await`. Therefore, we use the `built-in promisify` function provided by Node.js.

To utilize `promisify`, we first require the `util module` at the top of our code. We can destructure the `promisify` method from util, as we only need that specific function. With `promisify`, we can convert the `verify` function into a promise, allowing us to use `async/await`. We call `promisify` and pass the function as an argument. The resulting function is asynchronous and returns a promise. We can then `await` the function and store the decoded data (payload) in a variable, which we'll name `decoded`. For debugging purposes, we log the decoded data to the console.

At this point, we have successfully verified the token and obtained the decoded payload, which should include the `user ID`. To test this, By sending a request with the authorization header containing the JSON web token, we gain access to the protected route. The decoded object should contain the `user ID`, among other details.

Now, let's try manipulating the payload of the token. We can copy the token and modify its contents using the JWT debugger at `jwt.io`. By altering the data, the encoded token changes as well. Using the manipulated token, we attempt to access the protected route. As expected, we encounter an error named JsonWebTokenError with an invalid signature. This error occurs when the token has been tampered with.

To handle this error, we can add a `try-catch` block after the verification code. Instead of performing error handling within the middleware function, it's preferable to delegate it to the global error-handling middleware or error controller. In this case, we opt for the error controller approach. We check if the error's name property matches `JsonWebTokenError` and assign the appropriate error message. We create a function called `handleError` to generate a new `AppError` instance.

The `handleError` function is simple and returns a new `AppError` instance with the error message `Invalid token, please log in again` and an error code of `401` for `Unauthorized`. It's important to note that this implementation is suitable for production environments. By running the application in production mode and attempting to access the app with an invalid token, users will receive the specified error message.

Although many tutorials would stop at this point, it's important to note that this approach is not secure enough. We need to consider scenarios where the user may have been deleted or has changed their password after the token was issued. We don't want to log in a user who no longer exists or accept an outdated token after a password change.

To address these concerns, we will implement steps three and four. The first step is to check if the user still exists. This is relatively straightforward. We can use the `ID` stored in the payload to query the user using `User.findById(decoded.id)`. We store the retrieved user in a variable called `freshUser`. This step ensures that the `user's ID` in the decoded payload is correct and corresponds to an existing user. If the verification process in the previous step was successful, we can be confident in the validity of the user.

Next, we need to check if `freshUser` exists. If it doesn't, we return a new error. This pattern of returning an error and calling the next middleware is something we have seen before. In this case, it indicates that the user associated with the token no longer exists. We use the HTTP status code `401` to indicate unauthorized access.

Let's test this functionality by creating a new user. We'll use the same password for simplicity. To simulate a scenario where the user has been deleted, we'll delete the user before sending the request. By doing so, we simulate a situation where someone tries to log in with a token belonging to a user that has already been deleted. Our goal is to prevent this unauthorized access.

After deleting the user, we can observe that attempting to log in with the deleted user's token results in the error message we implemented. This demonstrates the successful implementation of the user existence check.

Testing is crucial, especially when it comes to authentication. Although it may lengthen the video, it's essential to ensure that all aspects of our code are thoroughly tested and validated.

Let's examine the code in detail and rewrite the paragraphs to provide a more readable and comprehensive explanation:

We have reached the point where we are testing the implementation of our created error message. Now, let's move on to the final step.

Step four involves checking whether the user has recently changed their password after the `token` was issued. To perform this verification, we need to create another instance method. This method will be accessible on all the documents, which are instances of a model.

The reason we create this method in the User model instead of the controller is that it requires a significant amount of code specific to the User model. It is unrelated to the controller's responsibilities.

Similar to how we implemented the `correctPassword static instance method` in the User model for password checking, we'll create a new method called `changedPasswordAfter`. This method takes a J`WT timestamp`, which indicates when the token was issued.

By default, the method will `return false`, indicating that the user has not changed their password after the token was issued. This acts as our initial assumption. However, if the `passwordChangedAt` property exists in the document (user object), we will perform a comparison.

Before proceeding, we need to add a `passwordChangedAt` field to the schema to track when the password was last changed. Currently, this field is not defined anywhere, and most documents (users) do not have this property in their data. Therefore, we need to handle this scenario.

If the `passwordChangedAt` property exists, we can proceed with the comparison. However, if it doesn't exist, it means the user has never changed their password, and we can immediately `return false`, indicating that the user has not changed their password after the specified timestamp.

To verify the implementation, we log `this.passwordChangedAt` and the JWT timestamp to the console. This allows us to see how we can compare the two values effectively.

Now, we need to create a user with the `passwordChangedAt` property set. Although we will implement the logic for changing the password later, we can artificially set this property when creating a new user. Let's use any date for now, such as April 30, 2019. After parsing the date, we can log it to the console to confirm that it works correctly.

To see the result, we need to call the `changedPasswordAfter` instance method on a `user document`. We retrieve the `JWT timestamp (decoded.iat)`and pass it as an argument. This method call will log the two values to the console for comparison.

Now, we need to convert `this.passwordChangedAt` to a timestamp format similar to the JWT timestamp. To achieve this, we create a new variable called `changedTimestamp` and use the `getTime` function available for JavaScript dates. However, we notice that the `timestamp` formats differ, with one in seconds and the other in `milliseconds`. To align them properly, we divide `changedTimestamp` by `1000` and parse the entire value as an `integer` using `parseInt`.

After comparing the `two timestamps`, we are ready to return the result. Remember that returning false indicates that the user has not changed their password. In this case, if the `JWT timestamp` is `less than` the `changedTimestamp`, it means the user changed their password after the token was issued. Consequently, we return `true` to indicate a password change.

In this section, we'll dive deeper into the code and understand its functionality and importance. Let's break it down step by step.

First, we check if the user has actually changed their password. If this condition is `true`, it means that the password has been changed, which is the scenario where we want an error to occur.

The code proceeds to the next step only if all the previous conditions are met. The `next` keyword is used to move to the `next route handler`, which grants access to the protected route.

The `next function` leads us to the next middleware, which is typically the route handler responsible for sending back the protected data.

Additionally, we want to include the entire user data in the request object. This can be achieved by assigning the `freshUser to req.user`.

It's worth noting that the code reaches this point only when everything is correct. This implementation can be useful for future purposes.

To test the code, we simulate a scenario where the password change is in the past. We generate a token after the password has been changed, and when we attempt to access the protected route with this token, we expect access to be granted.

However, to demonstrate a different scenario, we modify the date to be in the future using Compass. This change means the token was issued before the password was changed. Consequently, the user will be prompted to log in again since we don't want to grant access in such cases.

Finally, the protect middleware has been fully implemented, and we remove unnecessary console.log statements. Let's summarize the functionality:

1. Verification: The code verifies if the token payload has been tampered with by a malicious third party.

2. Retrieving the Current User: If the verification is successful, the code retrieves the current user based on the decoded payload.

3. User Existence Check: If the currentUser doesn't exist, access to the route is denied, and an appropriate error is created.

4. Password Change Check: If the currentUser exists, the code checks if a password change occurred after the token was issued. If it did, another error is generated. Otherwise, the code proceeds to the end of the middleware, where `currentUser is assigned to request.user`.

This allows us to pass data from one middleware to the next by storing it in the request object. By implementing this sophisticated route-protecting algorithm, we ensure secure and reliable access control.

Understanding the code in detail is crucial for building a robust authentication system. Though this explanation may seem lengthy, it's important to comprehend the intricacies to write reliable code. Thank you for your patience, and I'll see you in the next video.
