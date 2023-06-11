## creating user Schema

as we already learn how to create schema in mongoose, look at the `userModel` file for schema

Let's proceed with the creation of new users based on the model we implemented. We will handle user-related actions such as user creation, user login, and password updates in the authentication controller. This separation allows us to focus on authentication-specific tasks and maintain a more organized code structure.

Now, let's implement the route for the `signup` handler in the userRoutes file. Since the user resource is different from others due to its association with authentication, we need a separate controller and route for it. Import the authentication controller and create a new route using the `router.post` method for the `/signup` URL. Assign the `signup` function to this route. In this case, we only need a POST request, as it is the appropriate method for user signup.

It's worth noting that the `/signup` endpoint deviates from the typical REST architecture we discussed earlier. This endpoint follows a more descriptive naming convention, which aligns better with the action being performed. While other routes follow the REST philosophy, this endpoint serves a specific purpose related to user signup.

Remember that passwords should never be stored as plain text in a database for security reasons. The current implementation demonstrates the basic functionality, but password encryption and additional security measures will be addressed later.
