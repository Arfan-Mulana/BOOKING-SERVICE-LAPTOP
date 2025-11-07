import express from "express";

import {
  addStruk,
  updateStruk,
  findStruk,
} from "../controller/struk.controller.js";
import { Authorize } from "../controller/users.controller.js";
import { isAdmin } from "../middleware/roleValidation.js";

const app = express();

app.post("/AddStruk", Authorize, isAdmin, addStruk);
app.post("/Update", Authorize, isAdmin, updateStruk);
app.post("/FindStruk", Authorize, findStruk);

export default app;
