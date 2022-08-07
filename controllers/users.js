import Users from "../models/usersModel.js";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.find().select([
      "_id",
      "username",
      "email",
      "saldo",
    ]);
    res.json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const response = await Users.findById({ _id: req.params.id }).select([
      "_id",
      "username",
      "email",
      "saldo",
    ]);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      msg: "Cast to ObjectId failed for value: userId or username not Found!",
    });
  }
};
