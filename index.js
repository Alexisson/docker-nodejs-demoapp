import express from "express";
import exphbs from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import fs from "fs";
import mongoose from "mongoose";
import dbIndex from "./models/idx.js";
import dotenv from "dotenv";

const PORT = 80;
dotenv.config();

const app = express();
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app
  .engine("hbs", hbs.engine)
  .set("view engine", "hbs")
  .set("views", "views")
  .all("/", async (r) => {
    let data = fs.readFileSync("index.json");
    let dbindex = await dbIndex.find().sort({ $natural: -1 });
    r.res.render("index", {
      index: JSON.parse(data).index,
      dbindex: dbindex[0].index,
    });
  })
  .all("/local/inc", (r) => {
    let data = fs.readFileSync("index.json");
    let index = JSON.parse(data).index + 1;
    fs.writeFileSync("./index.json", JSON.stringify({ index }));
    r.res.render("local_index", { index });
  })
  .all("/local/dec", (r) => {
    let data = fs.readFileSync("index.json");
    let index = JSON.parse(data).index - 1;
    fs.writeFileSync("./index.json", JSON.stringify({ index }));
    r.res.render("local_index", { index });
  })
  .all("/db/inc", async (r) => {
    let data = await dbIndex.find();
    if (data.length === 0) {
      let newIdx = 1;
      const idx = new dbIndex({
        id: 1,
        index: newIdx,
      });
      await idx.save();

      r.res.render("db_index", { index: newIdx });
    } else {
      if (data.length === 1) {
        const idx = new dbIndex({
          id: 2,
          index: 2,
        });
        await idx.save();
      }
      let newIdx = data[data.length - 1].index + 1;
      const idx = new dbIndex({
        id: data[data.length - 1].id + 1,
        index: newIdx,
      });
      await idx.save();
      r.res.render("db_index", { index: newIdx });
    }
  })
  .all("/db/dec", async (r) => {
    let data = await dbIndex.find();
    if (data.length === 0) {
      let newIdx = 1;
      const idx = new dbIndex({
        id: 1,
        index: newIdx,
      });
      await idx.save();

      r.res.render("index", { index: newIdx });
    } else {
      if (data.length === 1) {
        const idx = new dbIndex({
          id: 2,
          index: 2,
        });
        await idx.save();
      }
      let newIdx = data[data.length - 1].index - 1;
      const idx = new dbIndex({
        id: data[data.length - 1].id + 1,
        index: newIdx,
      });
      await idx.save();
      r.res.render("index", { index: newIdx });
    }
  })
  .all("/about", (r) =>
    r.res.render("home", {
      port: PORT,
      hostname: "localhost",
      title: "Стартовая страница",
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
        `Connected to MongoDB Database. Running on http://localhost:${PORT}`
      )
    );
  } catch (e) {
    console.log(e);
  }
}
start();
