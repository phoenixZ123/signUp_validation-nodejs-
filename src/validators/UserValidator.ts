import { body } from "express-validator";
import User from "../models/User";
import { query } from "express-validator";

export class UserValidator {
  static signUp() {
    return [
      body("name", "Name is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
            // type: 'user'
          })
            .then((user) => {
              if (user) {
                throw new Error("User Already Exists");
              } else {
                return true;
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),

      body("phone", "Phone number is required").isString(),
      body("password", "Password is required")
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be bettween 8 to 20"),
      body("type", "User role type is required").isString(),
      body("status", "Status is required").isString(),
    ];
  }
  //
  static login() {
    return [
      query("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
            // type: 'user'
          })
            .then((user) => {
              if (user) {
                req.user = user;
                return true;
              } else {
                throw new Error(
                  "User doesn't found,Please try again or registered!!"
                );
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      query("password", "Password is required").isAlphanumeric(),
    ];
  }
  //
  static resetPassword() {
    return [
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          }).then((user) => {
            if (user) {
              req.user = user;
              return true;
            } else {
              throw "No User Registered with such email";
            }
          });
        }),
      body("new_password", "New Password is required").isAlphanumeric(),
      body("otp", "Reset Password token Otp is required")
        .isNumeric()
        .custom((otp, { req }) => {
          if (req.user.reset_password_token == otp) {
            return true;
          } else {
            req.errorStatus = 422;
            throw "Reset password token is invalid, please try again";
          }
        }),
    ];
  }
  //
  static verifyUserEmailToken() {
    return [
      body("verification_token", "verification token is required").isNumeric(),
    ];
  }
  static verifyUserForResendEmail() {
    return [
      body("verification_token", "Verification token is required").isNumeric(),
      body("email", "Email is required").isEmail(),
    ];
  }
  static verifyResetPasswordToken() {
    return [
      query("email", "Email is required").isEmail(),
      query("reset_password_token", "Reset password token is required")

        .custom((reset_password_token, { req }) => {
          return User.findOne({
            email: req.query.email,
            reset_password_token: reset_password_token,
            reset_password_token_time: { $gt: Date.now() },
          })
            .then((user) => {
              if (user) {
                return true;
              } else {
                // throw new Error('Reset password token doesn\'t exist. Please regenerate a new token.');
                throw "Reset password token doesn't exist. Please regenerate a new token.";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
    ];
  }
  //
  static checkResetPasswordEmail() {
    return [
      query("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                return true;
              } else {
                // throw new Error('No User Registered with such Email');
                throw "No User Registered with such Email";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
    ];
  }
}
