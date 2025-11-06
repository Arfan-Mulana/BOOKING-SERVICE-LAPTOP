import express from "express";

import {
  SignUp,
  LogIn,
  deltAcc,
  updateAcc,
  finAcc,
  Authorize,
} from "../controller/users.controller.js";
import { isAdmin } from "../middleware/roleValidation.js";

const app = express();

app.post("/SignUp", SignUp);
app.post("/LogIn", LogIn);
app.delete("/Delete", Authorize, isAdmin, deltAcc);
app.put("/Update/:id", Authorize, updateAcc);
app.get("/Find", Authorize, isAdmin, finAcc);

export default app;
