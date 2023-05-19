export const TYPES = {
    // Container
    Container: Symbol.for("Container"),

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
    Repository: Symbol.for("Repository"),
    Service: Symbol.for("Service"),
    Controller: Symbol.for("Controller"),

    // Application
    App: Symbol.for("App"),
};