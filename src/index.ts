import * as express from "express";
import { Server } from "../server";


const server=new Server().app;
server.listen(3000, () => {
  console.log("server running on port 3000");
});

