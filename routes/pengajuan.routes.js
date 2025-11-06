import express from "express";

import { addPengajuan } from "../controller/pangajuan.controller.js";

const app = express();

app.post("/TambahPengajuan", addPengajuan);

export default app;
