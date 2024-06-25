import { validationResult } from "express-validator";
import User from "../models/User";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import * as Bcrypt from "bcrypt";
import { getEnvironmentVariables } from "../environments/environment";
import { JwtVerify } from "../utils/JwtVerify";
export class UserController {
  static async SignUp(req, res, next) {
    try {
      const hash = await Utils.encryptPassword(req.body.password);
      const data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        verification_token: Utils.generateVerification_token(5),
        verification_token_time: Date.now() + new Utils().max_token_time,
        reset_password_token: Utils.generateVerification_token(5),
        reset_password_token_time: Date.now() + new Utils().max_token_time,
        password: hash,
        type: req.body.type,
        status: req.body.status,
      };

      const user = await new User(data).save();
      const payload = {
        aud: user._id,
        email: user.email,
      };
      const token = JwtVerify.jwtSign(payload);
      res.json({
        token: token,
        user: user,
      });
      // res.send(user);
      // await NodeMailer.sendMail({
      //   to: [data.email],
      //   subject: "test",
      //   html: `<h1>Your Otp is ${Utils.generateVerification_token(6)}<h1>`,
      // });
    } catch (e) {
      next(e);
    }
  }
  static async resetPassword(req, res, next) {
    const user = req.user;
    const new_password = req.body.new_password;
    try {
      const encryptPassword = await Utils.encryptPassword(new_password);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          updated_at: new Date(),
          password: encryptPassword,
        },
        { new: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }
  static async verifyResetPasswordToken(req, res, next) {
    try {
      await res.json({ success: true });

    } catch (e) {
      next(e);
    }
  }
  static async verifyUserEmailToken(req, res, next) {
    const verification_token = req.body.verification_token;
    const email = req.user.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        {
          email_verified: true,
          updated_at: new Date(),
        },
        {
          new: true,
        }
      );
      if (user) {
      } else {
        throw new Error(
          "Wrong Otp or Email verification token is Expired,Please try again"
        );
      }
    } catch (e) {
      next(e);
    }
  }
  static async resendVerificationEmail(req, res, next) {
    // res.send(req.decoded);
    const verification_token = Utils.generateVerification_token(5);
    const email = req.user.email;
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().max_token_time,
        }
      );
      if (user) {
        res.json({ success: true });
        // await NodeMailer.sendMail({
        //   to: [user.email],
        //   subject: "Email Verification",
        //   html: `<h1>Your Otp is ${Utils.generateVerification_token(6)}<h1>`,
        // });
      } else {
        throw new Error("Email verification token is Expired,Please try again");
      }
    } catch (e) {
      next(e);
    }
    res.send(req);
  }
  static async login(req, res, next) {
    const user = req.user;
    const email = req.query.email;
    const password = req.query.password;

    const data = {
      password,
      encrypt_password: user.password,
    };
    try {
      await Utils.comparePassword(data);
      const payload = {
        aud: user._id,
        email: user.email,
      };
      const token = JwtVerify.jwtSign(payload);
      res.json({
        token: token,
        user: user,
      });
    } catch (e) {
      next(e);
    }
  }
  static async sendResetPasswordOtp(req, res, next) {
    const email = req.query.email;
    const reset_password_token = Utils.generateVerification_token(5);
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          reset_password_token: reset_password_token,
          reset_password_token_time: Date.now() + new Utils().max_token_time
        }
      );
      if (user) {
        await res.json({ success: true });
        // await NodeMailer.sendMail({
        //   to: [user.email],
        //   subject: 'Reset password email vertification OTP',
        //   html: `<h1>Your Otp is ${reset_password_token}</h1>`
        // });
      } else {
        throw new Error('User doesn\'t exist');
      }
    } catch (e) {
      next(e);
    }
  }
}
