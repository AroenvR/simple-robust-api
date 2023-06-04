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
- Services: Execute any additional logic necessary for handling a request.
- Controllers: Handle incoming requests, process data, and return responses.
- Routes: Define the API endpoints and map them to the corresponding controllers.

## Data Flow

1. An incoming request is received by the Express server.
2. The request is routed to the corresponding controller based on the defined routes.
3. The controller processes the request and interacts with the appropriate service.
4. The service processes the request and interacts with the appropriate repository.
5. The repository executes a query on the database and returns the data to the controller.
6. The controller processes the data and sends the response back to the client.

## Logging

The application includes a built-in logging system that categorizes logs based on severity. The log levels are as follows:

- DEBUG: Only for developers, detailed information to help diagnose issues.
- INFO: Possibly useful information, not critical but may be helpful to understand the application or a user's behavior.
- LOG: Useful information, generally informative messages that highlight the progress of the application.
- WARN: Should be paid attention to, could indicate potential problems or security risks.
- ERROR: Should be looked at, as it could break something or be a security risk.
- CRITICAL: This could break the application or be a severe security risk, requires immediate attention.

Logs can be found in the designated log files or in the console, depending on the server configuration.

<hr/>

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

# Adding a new functional object to the API
Example with a User object

### Entity / DTO setup (copy-pasta for issues):
```
- [ ] Create an Entity interface - interface IUser implements IEntity
- [ ] Create an Entity class - class User extends Entity implements IUser
- [ ] Create a DTO - class UserDTO extends DataTransferObject implements IUser
- [ ] Create a schema - const UserSchema
```

### Business logic setup (copy-pasta for issues):
```
- [ ] Create a Repository interface - interface IUserRepo extends IRepository
- [ ] Create a Repository class - class UserRepo extends Repository implements IUserRepo
- [ ] Create a Service interface - interface IUserService extends IService
- [ ] Create a Service class - class UserService extends Service<IUserRepo> implements IUserService
- [ ] Create a Controller interface - interface IUserController extends IController
- [ ] Create a Controller class - class UserController extends Controller<IUserService> implements IUserController
```

### Final steps (copy-pasta for issues):
```
- [ ] Add the new objects to the src/database/schema/knexSchemaBuilder function
- [ ] Add the new service layers to the src/ioc/ContainerWrapper initBusinessLogic function
```

## Contributing
// TODO

## License
// TODO. MIT maybe?