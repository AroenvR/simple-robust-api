import { constants } from "../util/constants";

const express = require('express');
const cors = require('cors');
const app = express();

// https://www.youtube.com/watch?v=-MTSQjw5DrM&t=242s

app.options('*', cors());
app.use(express.json());
app.listen(constants.app_data.PORT, () => console.log(`App running on: http://localhost:${constants.app_data.PORT}/`));

export default app;