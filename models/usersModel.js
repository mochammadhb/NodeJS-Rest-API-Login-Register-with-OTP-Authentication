import mongoose from "mongoose";

const Users = mongoose.model("db_users", {
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  saldo: {
    type: Number,
    require: true,
    default: 0,
  },
  details: {
    phone_number: {
      type: String,
      require: true,
    },
    isVerification: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  refresh_token: {
    type: String,
    require: true,
    default: null,
    max: 1024,
  },
});

export default Users;
