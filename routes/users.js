import { Router } from "express";
import verify from "../middleware/token.js";
import {
  Login,
  Logout,
  RefreshToken,
  Register,
} from "../controllers/authenticate.js";
import { getUsers, getUsersById } from "../controllers/users.js";
import { RegisterOTP, VerifOTP } from "../controllers/OTPVerification.js";

const router = new Router();

// getUsers
router.get("/users", verify, getUsers);
router.get("/users/:id", verify, getUsersById);

// authenticate
router.post("/register", Register);
router.get("/otp-verification", RegisterOTP);
router.post("/otp-verification", VerifOTP);
router.post("/login", Login);
router.delete("/logout", Logout);
router.get("/refresh_token", RefreshToken);

export default router;
