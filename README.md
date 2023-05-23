In this section, we will delve into the topic of environment variables. While this concept is not specific to Express, it plays a crucial role in Node.js development in general.

Node.js and Express applications can operate in various environments, with the most significant ones being development and production. Depending on the environment, we may need to use different databases, enable or disable features like login or debugging, or adjust other settings specific to each environment. Environment variables serve as a means to handle these variations.

By default, Express sets the environment to "development," which aligns with the initial phase of a project. Let's examine this variable within our server code. It's important to note that any code unrelated to Express should be placed outside the app.js file. We only use that file to configure our Express application, while environment variables lie outside the scope of Express itself.

To demonstrate, we can log the value of `app.get('env')` and observe that it returns `development`. Thus, we can use `app.get('env')` to access the environment variable.

In summary, environment variables are global variables used to define the operating environment of a Node.js application. Express sets one of these variables, but Node.js itself also sets several environment variables. To explore the latter, we can examine `process.env`, which contains a multitude of variables. Although we won't delve into each one, it's worth noting that Node.js relies on them internally. Examples include the current working directory, home folder, login name, and the script used to initiate the process.

These variables originate from the process core module and are set when the process starts. We don't need to explicitly require the process module as it is available automatically throughout our code.

In Express, many packages rely on a conventionally named variable called `NODE_ENV`, which signifies whether the application is in development or production mode. However, Express doesn't define this variable by default, so we need to set it manually. There are multiple approaches to achieve this, but let's start with the simplest one: using the terminal.

If we recall, we started our process using `npm start`, which corresponds to `nodemon server`. To set an environment variable for this process, we need to prepend the variable to the command. For example, we can use `NODE_ENV=development nodemon server.js` to explicitly set the `NODE_ENV` variable. Starting the process now will reflect the change, with the `NODE_ENV` variable displaying "development." We can define additional variables in the same manner, such as `NODE_ENV=development x=23 nodemon server.js`, which will associate the value 23 with the X environment variable.

Many npm packages used in Express development depend on the `NODE_ENV` variable. When our project is ready for deployment, we should change the `NODE_ENV` variable to "production." We will do this at the end of the course when we deploy the project.

Environment variables offer more than just NODE_ENV and X variables. They serve as configuration settings for our applications, enabling us to adapt to different environments. For instance, we can use different databases for development and testing by defining a variable for each and activating the appropriate database based on the environment. Additionally, sensitive information like passwords and usernames can be stored securely using environment variables.
