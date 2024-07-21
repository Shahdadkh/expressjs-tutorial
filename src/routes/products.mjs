import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log(request.signedCookies.Hello);
  if (request.signedCookies.Hello && request.signedCookies.Hello === "World")
    return response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);

  return response
    .status(403)
    .send({ msg: "sorry. you need the correct cookie." });
});

export default router;
