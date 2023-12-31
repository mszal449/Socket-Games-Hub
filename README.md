# Socket-Games-Hub

## Overview

This project is a Socket.io-based game hub, showcasing a multiplayer 
checkers game. The server is constructed with Node.js and Express, 
while communication between the client and server is managed by Socket.io. 
User authentication incorporates password encryption and signed cookies 
for secure data storage. The project relies on the MongoDB database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Installation

1. **Clone the repository:**
    ```
    git clone <repository-url>
    ```

2. **Install Dependencies:**
    ```
    npm install
    ```

3. **Create `.env` file:**
   Create a `.env` file in the root of the project and configure the environmental variables.
    ```
    COOKIE_SECRET=your-cookie-secret
    MONGO_URI=your-mongo-uri
    PORT=3000
    ```

## Usage
The server will be running at ```http://localhost:<your_port>``` (replace <your_port> with port from .env file)
by default. 
Make sure to set up the required environment variables as described [Installation](#installation) section.


## Technologies Used

#### Server-Side Technologies:

- **Node.js (v0.0.0):**
   - Main runtime environment for the server-side JavaScript execution.

- **Express (v4.18.2):**
   - Web application framework used to build the server and handle HTTP requests.

- **Socket.io (v4.7.2):**
   - Enables real-time, bidirectional, and event-based communication between the server and clients.

- **MongoDB (v8.0.2):**
   - A NoSQL database used for storing data related to user authentication.

- **Mongoose (v8.0.2):**
   - MongoDB object modeling for Node.js, providing a schema-based solution to model application data.

#### Authentication and Security:

- **bcryptjs (v2.4.3):**
   - Library for hashing passwords, enhancing security by encrypting and securely storing user passwords.

- **Cookie (v0.6.0) and Cookie-Parser (v1.4.6):**
   - Used for handling cookies, including signed cookies, to maintain user sessions securely.

- **dotenv (v16.3.1):**
   - Allows loading environment variables from a .env file, facilitating a more secure configuration.

#### Frontend Rendering:

- **Nunjucks (v3.2.4):**
   - Templating engine for server-side rendering, simplifying the generation of dynamic HTML content.

#### HTTP Requests and CORS:

- **Axios (v1.6.2):**
   - A promise-based HTTP client used for making HTTP requests, particularly in handling external APIs.

- **CORS (v2.8.5):**
   - Middleware enabling Cross-Origin Resource Sharing, allowing the server to handle requests from different origins.

#### Miscellaneous:

- **UUID (v9.0.1):**
   - Generates unique identifiers that are used, for example, to identify individual game sessions.

#### Development Tools:

- **Nodemon (v3.0.1):**
   - Monitors changes in the application and automatically restarts the server during development.

These technologies collectively contribute to the functionality, security, and real-time communication capabilities of the Socket-Games-Hub application.








