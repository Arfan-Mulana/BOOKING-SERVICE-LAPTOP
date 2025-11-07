import express from "express";

import {
  addPengajuan,
  updatePengajuan,
  findPengajuan,
} from "../controller/pangajuan.controller.js";
import { Authorize } from "../controller/users.controller.js";
import { isAdmin, isUser } from "../middleware/roleValidation.js";

const app = express();

app.post("/TambahPengajuan", Authorize, isUser, addPengajuan);
app.put("/UpdatePengajuan/:id", Authorize, isUser, updatePengajuan);
app.get("/FindPengajuan", Authorize, isAdmin, findPengajuan);

export default app;
