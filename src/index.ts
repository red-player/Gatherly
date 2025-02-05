require('dotenv').config()

import express from "express";
import { json } from "body-parser";
// import cors from "cors";
import { ENV, PORT } from "./config";
import { routes } from "./routes";

const cors = require('cors');

// ? declaring express app
const app = express();
app.use(cors());
app.use(json());
app.use(routes);

// ? listening port
app.listen(PORT, () => {
    console.log("listening on port " + PORT);
    console.log("listening on port " + ENV);
});
