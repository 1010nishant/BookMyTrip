## authorization

Welcome back!

In our project so far, we have successfully implemented authentication, allowing users to log in. However, there are cases where authentication alone is not sufficient. In this video, we will address this by implementing authorization.

Authorization comes into play when we consider actions such as deleting a tour from our database. Not all users should have the privilege to perform this action, even if they are logged in. Authorization is the process of verifying whether a specific user has the necessary rights to interact with a particular resource.

With authorization, we check if a logged-in user is allowed to access a specific resource. This means that not all logged-in users will have the same level of access to our API. Implementing authorization is a common requirement for web applications.

To achieve this, we will create another middleware function to restrict access to certain routes. For example, we want to restrict the deletion of tours to specific user roles. We will add this middleware to the stack of route handlers.

The first middleware in the stack will always be the `protect` middleware, which checks if a user is logged in. Even if an administrator attempts to delete a tour, they still need to be authenticated. Following that, we will include the `restrictTo` middleware from the `authController` module.

The `restrictTo` middleware will take user roles as arguments to determine who is authorized to interact with the resource. In this case, we want only administrators to be able to delete tours. We define the user roles using strings, such as `admin`

We need to update our user model to include the role property. We will use the `enum` validator to restrict the allowed roles to a specific set. In our case, we have `user` `guide` `lead-guide` and `administrator` The user roles can vary depending on the application's domain.

Additionally, we set a default role, so we don't have to specify the role every time we create a new user. The default role we set is `user`

Now that we have set up the roles, we can modify the `restrictTo` middleware to allow multiple arguments. In this case, we want both the `admin` and the `lead guide` to be able to delete tours. We update the middleware accordingly.

To handle passing arguments to the middleware, we create a wrapper function that returns the actual middleware function. This allows us to pass the desired roles as arguments to the middleware, which is not typically possible.

The following is an extensive explanation of the code and its functionality:

To understand the code, let's break it down step by step.

First, let's talk about the purpose of the code. It aims to restrict access to certain routes based on the user's role. It ensures that only users with specific roles specified in an array are granted permission to access protected routes.

The code begins by defining a function using the ES6 rest parameter syntax`(...roles)`. This syntax allows the function to accept any number of arguments and store them in an array. These arguments represent the `roles` that are allowed to interact with the protected route.

Inside this function, a middleware function is returned. The middleware function has access to the roles array due to the concept of closure.

The middleware function takes three parameters: `request, response, and next`. These parameters are standard for Express middleware functions.

Within the middleware function, the current user's role is retrieved from the request object, specifically from `request.user.role`.

The middleware then checks if the current `user's role` is included in the `roles` array using the includes method. If the user's role is not found in the `roles array`, it means they do not have permission to access the route. In this case, an error is created with a status code of `403(forbidden)`, and the next middleware is not called.

If the user's role is included in the `roles array`, the middleware function calls the next middleware, allowing the user to proceed to the protected route.

To summarize, this code creates a middleware function called restrictTo that restricts access to certain routes based on the user's role. It receives an array of roles as input and checks if the current user's role is included in that array. If the user's role is not found, they are denied access with a 403 status code. Otherwise, they are allowed to proceed to the next middleware and access the protected route.

It's important to note that this code is just an example, and in a real-world scenario, you would likely have more complex logic and additional security measures in place to handle role-based access control.
