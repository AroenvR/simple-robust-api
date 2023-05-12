export const TYPES = {
    // Configs
    IDatabaseConfig: Symbol.for("IDatabaseConfig"),
    IAppConfig: Symbol.for("IAppConfig"),

    // Utils
    PubSub: Symbol.for("PubSub"),
    TaskProcessor: Symbol.for("TaskProcessor"),
    Logger: Symbol.for("Logger"),
    RouteInitEvent: Symbol.for("RouteInitEvent"),

    // Business Logic
    Database: Symbol.for("Database"),
    UserRepo: Symbol.for("UserRepo"),
    UserService: Symbol.for("UserService"),
    UserController: Symbol.for("UserController"),

    // Application
    App: Symbol.for("App"),
};