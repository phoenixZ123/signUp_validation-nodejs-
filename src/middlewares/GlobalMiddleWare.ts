import { validationResult } from "express-validator";
import { JwtVerify } from "../utils/JwtVerify";

export class GlobalMiddleWare {
  static checkError(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  }
  static async auth(req, res, next) {
    const header_auth = req.headers.authorization;
    const token = header_auth ? header_auth.slice(4, header_auth.length) : null;
    // const authHeader = header_auth.split(" ");
    // const token1 = authHeader[1];
    try {
      req.errorStatus = 401;
      if (!token) { new Error("User doesn\'t exist") }
      const decoded = await JwtVerify.jwtVerify(token);
      req.user = decoded;
      next();
    } catch (e) {
      next(new Error("User doesn\'t exists"));
    }
  }
}
