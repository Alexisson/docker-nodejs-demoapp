import express from "express";
import os from "os";
import exphbs from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

const PORT = 80;
const host = "0.0.0.0";

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
  .all("/", (r) =>
    r.res.render("home", {
      port: PORT,
      hostname: host,
      title: "Стартовая страница",
      name: "Иван",
    })
  )
  .listen(PORT, () => console.log(`Running on http://${host}:${PORT}`));
