import express from "express";

import { addStruk } from "../controller/struk.controller.js";
import { Authorize } from "../controller/users.controller.js";
import { isAdmin } from "../middleware/roleValidation.js";

const app = express();

app.post("/AddStruk", Authorize, isAdmin, addStruk);

export default app;
