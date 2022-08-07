import Users from "../models/usersModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { username, email, phone_number, password, retypePassword } = req.body;

  if((username,email,phone_number,password,retypePassword) == null || (username,email,phone_number,password,retypePassword) == "") return res.status(403).json({msg: "Form Register can't empty!"})
	  
  const validasi = await Users.findOne({
    $or: [
      { username: username },
      { email: email },
      { "details.phone_number": phone_number },
    ],
  });
  if (validasi) return res.status(403).json({ msg: "already exists!" });
  if (password !== retypePassword)
    return res
      .status(403)
      .json({ msg: "password or retype password doest'n match" });
  const hashPassword = await argon2.hash(password);
  try {
    const users = new Users({
      username,
      email,
      details: { phone_number: phone_number },
      password: hashPassword,
    });
    await users.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.find({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });

    const match = await argon2.verify(user[0].password, req.body.password);
    if (!match)
      return res.status(403).json({ msg: "email or password is not correct!" });
    const { _id, username, email, saldo } = user[0];
    const accessToken = jwt.sign(
      { _id, username, email, saldo },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );
    const refreshToken = jwt.sign(
      { _id, username, email, saldo },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await Users.findByIdAndUpdate(_id, {
      refresh_token: refreshToken,
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ accessToken });
  } catch (error) {
    res.status(500).json({ msg: "email or password is not correct!" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const users = await Users.find({ refresh_token: refreshToken });
  if (!users[0]) return res.sendStatus(204);
  await Users.findByIdAndUpdate(
    { _id: users[0]._id },
    {
      refresh_token: null,
    }
  );
  res.clearCookie("refreshToken").end();
};

export const RefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  const users = await Users.find({ refresh_token: refreshToken });
  if (!users[0]) return res.sendStatus(401);
  const { _id, username, email, saldo } = users[0];
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { _id, username, email, saldo },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s",
      }
    );
    res.json({ accessToken });
  });
};
