import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/userRoute.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use('/api/user',userRouter);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
