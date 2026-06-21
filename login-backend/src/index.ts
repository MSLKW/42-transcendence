import express from "express";
import { FileUserStore } from "./store/FileUserStore";
import { signupHandler } from "./handlers/signup";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  if (req.method === "POST" && !req.is("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }
  next();
});

//replace with actual db user store class like MongoUserStore()
const userStore = new FileUserStore();

app.post("/signup", signupHandler(userStore));

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
