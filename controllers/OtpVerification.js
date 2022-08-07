import Users from "../models/usersModel.js";
import twilio from "twilio";

export const RegisterOTP = async (req, res) => {
  const client = twilio(process.env.AccountSID, process.env.AuthToken);
  try {
    await client.verify.v2
      .services(process.env.ServiceID)
      .verifications.create({
        to: `+${req.query.phone_number}`,
        channel: "sms",
      });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const VerifOTP = async (req, res) => {
  const { verify_phone_number } = req.query;

  const users = await Users.find({
    "details.phone_number": verify_phone_number,
  });
  const client = twilio(process.env.AccountSID, process.env.AuthToken);
  try {
    const response = await client.verify.v2
      .services(process.env.ServiceID)
      .verificationChecks.create({
        to: `+${verify_phone_number}`,
        code: req.body.otp,
      });

    if (response.status === "approved") {
      await Users.findByIdAndUpdate(
        {
          _id: users[0]._id,
        },
        {
          "details.isVerification": true,
        }
      );
      res.status(200).json({ msg: "Create new account successfull." });
    } else {
      return res.status(403).json({
        msg: "OTP Verification is invalid!",
        status: response.status,
      });
    }
  } catch (error) {
    const status = error.message;
    if (status.includes("Invalid parameter")) {
      res.status(500).json({
        msg: "Verification pending, Invalid phone number!",
      });
    } else if (status.includes("VerificationCheck was not found")) {
      res.status(500).json({
        msg: "VerificationCheck not founds",
      });
    }
  }
};
