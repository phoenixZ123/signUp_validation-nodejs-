import mongoose from "mongoose";
import { getEnvironmentVariables } from "./src/environments/environment";
import * as express from "express";
import UserRouter from "./src/routers/UserRouter";
import * as bodyParser from "body-parser";
import * as cors from "cors";
export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.UserRoutes();
    this.error404Handler();
    // this.handleErrors();
  }
  setConfigs() {
    this.connectMongodb();
    this.setConfigBodyParser();
    this.allowCors();
  }
  allowCors() {
    this.app.use(cors());
  }
  setConfigBodyParser() {
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
  }
  connectMongodb() {
    mongoose
      .connect(getEnvironmentVariables().db_uri)
      .then(() => {
        console.log("connected to mongodb");
      })
      .catch((e) => {
        console.log(e);
      });
  }
  UserRoutes() {
    this.app.use("/api/user", UserRouter);
  }
  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "This cause error",
        status_code: 404,
      });
    });
  }
  handleErrors() {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message || "Something went wrong. Please try again!",
        status_code: errorStatus,
      });
    });
  }
}
