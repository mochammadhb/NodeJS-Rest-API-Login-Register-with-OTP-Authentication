import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./configs/database.js";
import Users from "./routes/users.js";

dotenv.config();
const app = express();
const port = process.env.LOCAL_PORT || 5000;

db.then(() => console.log("Database Connnection is successfully.")).catch(
  (err) => console.log(err.message)
);

app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());
app.use("/auth/", Users);

app.listen(port, () =>
  console.log(`Server up and running at Local Port ${port}`)
);
