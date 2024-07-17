import express from "express";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/ValidationSchemas.mjs";

const app = express();
app.use(express.json());

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};
app.use(loggingMiddleware);

const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mochUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};

const PORT = process.env.PORT || 3000;

const mochUsers = [
  { id: 1, username: "gfawltey0", displayname: "sclemmow0" },
  { id: 2, username: "bbrophy1", displayname: "jbernardez1" },
  { id: 3, username: "ikillingsworth2", displayname: "bhaddinton2" },
  { id: 4, username: "rdorning3", displayname: "cgosnold3" },
  { id: 5, username: "jgiovannelli4", displayname: "kbaynam4" },
  { id: 6, username: "glankester5", displayname: "rlambin5" },
  { id: 7, username: "edawidowicz6", displayname: "plineen6" },
  { id: 8, username: "gwaber7", displayname: "bdamant7" },
  { id: 9, username: "thulbert8", displayname: "lcasassa8" },
  { id: 10, username: "hbleakman9", displayname: "relster9" },
];

app.get("/", (request, response) => {
  response.send({ msg: "hello world" });
});

//localhost/api/users?filter=username&value=gfa
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    console.log(validationResult(request));
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        mochUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mochUsers);
  }
);

app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mochUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    const data = matchedData(request);
    const newUser = { id: mochUsers[mochUsers.length - 1].id + 1, ...data };
    mochUsers.push(newUser);
    return response.status(201).send(newUser);
  }
);

app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mochUsers[findUserIndex] = { id: mochUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mochUsers[findUserIndex] = { ...mochUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mochUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
