import { Router } from "express";
import passport from "passport";
//import "../strategies/local-strategy.mjs";
import "../strategies/discord-strategy.mjs";

const router = Router();

router.post(
  "/api/auth",
  passport.authenticate("local"),
  (request, response) => {
    response.sendStatus(200);
  }
);

router.get("/api/auth/status", (request, response) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);
  console.log(request.session);
  console.log(request.sessionID);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logOut((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  });
});

router.get("/api/auth/discord", passport.authenticate("discord"));
router.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (request, response) => {
    console.log(request.session);
    console.log(request.user);
    response.sendStatus(200);
  }
);

export default router;
