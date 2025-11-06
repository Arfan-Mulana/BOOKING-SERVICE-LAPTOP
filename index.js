import express from "express";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
