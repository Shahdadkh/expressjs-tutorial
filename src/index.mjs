import express from "express";
import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser("secretKey"));
app.use(routers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  response.cookie("Hello", "World", { maxAge: 60000, signed: true });
  response.send({ msg: "Hello" });
});
