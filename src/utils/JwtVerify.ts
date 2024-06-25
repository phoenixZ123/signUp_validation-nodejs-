import { getEnvironmentVariables } from "../environments/environment";
import * as Jwt from "jsonwebtoken";
export class JwtVerify {
  static jwtSign(payload, expires_In: string = "180d") {
    return Jwt.sign(payload, getEnvironmentVariables().jwt_secret_key, {
      expiresIn: expires_In, issuer: 'phuephue1125@gmail.com'
    });
  }
  static jwtVerify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret_key,
        function (err, decoded) {
          if (err) reject(err);
          else if (!decoded) reject(new Error("User is not authorize :) "));
          else {
            resolve(decoded);
          }
        }
      );
    });
  }
}
