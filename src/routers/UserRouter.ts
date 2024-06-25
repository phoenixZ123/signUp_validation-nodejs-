import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidator } from "../validators/UserValidator";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";

class UserRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.postRoute();
    this.getRoute();
    this.patchRoute();
    this.putRoute();
    this.deleteRoute();
  }
  postRoute() {
    this.router.post(
      "/signup",
      UserValidator.signUp(),
      GlobalMiddleWare.checkError,
      UserController.SignUp
    );
  }
  getRoute() {
    //
    this.router.get("/send/reset/password/token", UserValidator.checkResetPasswordEmail(), GlobalMiddleWare.checkError, UserController.sendResetPasswordOtp);
    //
    this.router.get(
      "/send/verification/email",
      // UserValidator.verifyUserForResendEmail(),
      // GlobalMiddleWare.checkError
      GlobalMiddleWare.auth,
      UserController.resendVerificationEmail
    );
    //
    this.router.get(
      "/login",
      UserValidator.login(),
      GlobalMiddleWare.checkError,
      UserController.login
    );
    //
    this.router.get('/verify/resetPasswordToken', UserValidator.verifyResetPasswordToken(), GlobalMiddleWare.checkError, UserController.verifyResetPasswordToken);


  }
  patchRoute() {
    this.router.patch(
      "/reset/password",
      UserValidator.resetPassword(),
      GlobalMiddleWare.checkError,
      UserController.resetPassword
    );
    this.router.patch(
      "/verify/emailToken",
      UserValidator.verifyUserEmailToken(),
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      UserController.verifyUserEmailToken
    );
  }
  putRoute() { }
  deleteRoute() { }
}

export default new UserRouter().router;
