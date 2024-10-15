# Mango Backend

This is the backend for the Mango project, version 1.0.0.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/)
* You have a Windows/Linux/Mac machine.
* You have access to MongoDB Atlas or a local MongoDB installation.

## Installing Mango Backend

To install Mango Backend, follow these steps:

1. Clone the repository
   ```sh
   git clone <repository-url>
2. Naviagate to the project directory
    ```sh
    cd mango
3. Install Dependencies
    ```sh
    npm install
### Configuring the Environment
This project uses dotenv for environment variable management and a constants file for certain configurations. You need to set up your own .env file and be aware of the constants.js file:
    
    1. Create a file named .env in the root directory of the project.
    2. Add the following variables to the .env file
        PORT=8000
        MONGODB_URI=<your-mongo-db-connection-string>
        CORS_ORIGIN=*
    
    3. Locate the constants.js file in the project. This file contains the DB_NAME constant used in the MongoDB connection.

### Setting up MongoDB

To run this project locally, you need to set up a MongoDB database. Here are the steps:

1. Create a MongoDB Atlas account:

    Go to MongoDB Atlas and sign up for a free account if you don't have one.
    Create a new project and cluster.

2. Get your MongoDB connection string:

    In your cluster, click on "Connect".
    Choose "Connect your application".
    Copy the connection string.

3. Update your `.env` file:

    Replace <your-mongodb-connection-string> in your .env file with the connection string you copied.
    Make sure to replace <password> in the connection string with your actual MongoDB user password.
    Do not include the database name in the connection string as it's specified separately in constants.js.

Example .env entry:
    
    MONGODB_URI=mongodb+srv://yourusername:<password>@yourcluster.mongodb.net

4. Check `constants.js`:

Ensure that the DB_NAME in constants.js is set to your desired database name.
The application will use this constant to connect to the specific database.
        
The MongoDB connection is established using:
    
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    
### Running the Application
To run the application in development mode, use the following command
`npm run dev`

This command uses nodemon to watch for file changes and automatically restart the server.


### Project Structure

- src/index.js: The main entry point of the application.
- src/constants.js: Contains constant values used throughout the application, including DB_NAME.
- .env: Contains environment-specific variables.

### Dependencies

cookie-parser: ^1.4.7
cors: ^2.8.5
dotenv: ^16.4.5
express: ^4.21.1
mongoose: ^8.7.1
zod: ^3.23.8

### Dev Dependencies

nodemon: ^3.1.7

### License
This project is licensed under the ISC License.



