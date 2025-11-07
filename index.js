import express from "express";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import pengajuanRoutes from "./routes/pengajuan.routes.js";
import strukRoutes from "./routes/struk.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/user", userRoutes);
app.use("/booking", pengajuanRoutes);
app.use("/bill", strukRoutes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
