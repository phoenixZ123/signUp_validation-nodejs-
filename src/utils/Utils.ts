import * as Bcrypt from "bcrypt";
import { getEnvironmentVariables } from "../environments/environment";
import * as Jwt from "jsonwebtoken";
export class Utils {
  public max_token_time = 60 * 5 * 1000;

  static generateVerification_token(digit: number) {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < digit; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    // return parseInt(otp);
    return otp;
  }

  static encryptPassword(password) {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }
  static comparePassword(data: {
    password: string;
    encrypt_password: string;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(data.password, data.encrypt_password, (err, same) => {
        if (err) {
          reject(err);
        } else if (!same) {
          throw new Error("User & Password doesn't match , Please try again");
        } else {
          resolve(true);
        }
      });
    });
  }
}
