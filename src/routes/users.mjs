import { Router } from "express";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "../utils/ValidationSchemas.mjs";
import { mochUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const router = Router();

//localhost/api/users?filter=username&value=gfa
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    //console.log(validationResult(request));
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

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mochUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());

    const data = matchedData(request);
    console.log(data);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }
  }
);

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mochUsers[findUserIndex] = { id: mochUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mochUsers[findUserIndex] = { ...mochUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mochUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
