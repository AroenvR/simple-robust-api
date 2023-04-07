import iocContainer from './providers/containerProvider';
import { runFooApi } from "./controller/fooApi";

const app = iocContainer.App;
app.start();



// runFooApi(); // TODO

// const fooDb = async () => {
//     let config: IDatabaseConfig = {
//         filename: './to_improve.db'
//     }

//     let db = new Database(config);
//     db.connect();

//     let userRepo = new UserRepo(db);
//     console.log("userRepo.getUsers():", userRepo.getUsers());
// }
// fooDb();