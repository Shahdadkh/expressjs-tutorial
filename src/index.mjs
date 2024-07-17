import express from "express";
import routers from "./routes/index.mjs";

const app = express();

app.use(express.json());
app.use(routers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  response.send({ msg: "hello world" });
});
