# Simple TypeScript API with Spring Magic

This is a simple TypeScript API that utilizes Spring magic, inspired by the knowledge gained in school.

# Application Overview

This application is a modular and scalable server-side implementation using TypeScript, Express, a (supported) database of choice.  
The application is structured using a Dependency Injection Container to manage dependencies and services throughout the application.

- Currently supported databases:  
    - SQLite3

## Main Components

- App: The core of the application, responsible for starting and stopping the server, initializing the database, and setting up the routes.
- Container: Manages the dependencies and services in the application, providing methods to register and get instances of services.
- Repositories: Interact with the database to perform CRUD operations on specific entities (e.g., Users).
- Controllers: Handle incoming requests, process data, and return responses.
- Routes: Define the API endpoints and map them to the corresponding controllers.

## Data Flow

1. An incoming request is received by the Express server.
2. The request is routed to the corresponding controller based on the defined routes.
3. The controller processes the request and interacts with the appropriate repository to perform the required database operations.
4. The repository returns the data to the controller.
5. The controller processes the data and sends the response back to the client.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)  
- [TypeScript](https://www.typescriptlang.org/download)

### Installation

1. Clone the repository  
git clone https://github.com/your-username/your-repository.git

2. Navigate to the project folder  
``cd your-repository``

3. Install dependencies  
``npm i``

## Running the Application

To start the server, run the following command:  
``npm start``

The API will be available at ``http://localhost:3000``.

## Testing

To run tests, execute the following command:  
``npm run test``


## Contributing
// TODO

## License
// TODO