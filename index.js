import express from "express";
import os from "os";
import exphbs from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import fs from "fs";

const PORT = 80;
var index = 0;
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
  .all("/", (r) => {
    let data = fs.readFileSync("index.json");
    r.res.render("index", { index: JSON.parse(data).index });
  })
  .all("/stat", (r) => {
    let data = fs.readFileSync("index.json");
    let index = JSON.parse(data).index + 1;
    fs.writeFileSync("./index.json", JSON.stringify({ index }));
    r.res.render("index", { index });
  })
  .all("/about", (r) =>
    r.res.render("home", {
      port: PORT,
      hostname: "localhost",
      title: "Стартовая страница",
      name: "Иван",
    })
  )

  .listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
