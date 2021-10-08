import express from "express";
import fs from "fs";
import dbIndex from "./models/idx.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import os from "os";
import { setLocalIndex, setDbIndex } from "./controllers/setIndex.js";
dotenv.config();

const app = express();

app

  .set("view engine", "ejs")
  .set("views", "views")
  .all("/", async (r) => {
    let data = fs.readFileSync("index.json");
    let dbindex = await dbIndex.find().sort({ $natural: -1 });
    r.res.render("index", {
      title: "Home index",
      index: JSON.parse(data).index,
      dbindex: dbindex[0].index,
    });
  })
  .all("/local/inc", (r) => {
    r.res.render("local_index", {
      title: "Local increment",
      index: setLocalIndex("+"),
    });
  })
  .all("/local/dec", (r) => {
    r.res.render("local_index", {
      title: "Local decrement",
      index: setLocalIndex("-"),
    });
  })
  .all("/db/inc", async (r) => {
    r.res.render("d_index", {
      title: "Database increment",
      dbindex: await setDbIndex("+"),
    });
  })
  .all("/db/dec", async (r) => {
    r.res.render("d_index", {
      title: "Database decrement",
      dbindex: await setDbIndex("-"),
    });
  })
  .all("/about", (r) =>
    r.res.render("about", {
      port: process.env.PORT || 5000,
      hostname: os.hostname,
      title: "Приветствие",
      name: "Иван",
    })
  );

async function start() {
  try {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(process.env.PORT || 5000, () =>
      console.log(
        `Connected to MongoDB Database. Running on http://${os.hostname}:${
          process.env.PORT || 5000
        }`
      )
    );
  } catch (e) {
    console.log(e);
  }
}
start();
