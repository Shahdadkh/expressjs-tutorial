import express, { request, response } from "express";

const app = express();

app.use(express.json());

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
app.get("/api/users", (request, response) => {
  const {
    query: { filter, value },
  } = request;
  if (filter && value)
    return response.send(
      mochUsers.filter((user) => user[filter].includes(value))
    );
  return response.send(mochUsers);
});

app.get("/api/users/:id", (request, response) => {
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId))
    return response.status(400).send({ msg: "bad request. invalid Id." });
  const findUser = mochUsers.find((user) => user.id === parsedId);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

app.post("/api/users", (request, response) => {
  const { body } = request;
  const newUser = { id: mochUsers[mochUsers.length - 1].id + 1, ...body };
  mochUsers.push(newUser);
  return response.status(201).send(newUser);
});

app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mochUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mochUsers[findUserIndex] = { id: parsedId, ...body };
  return response.sendStatus(200);
});

app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mochUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mochUsers[findUserIndex] = { ...mochUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.delete("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mochUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mochUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
