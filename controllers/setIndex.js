import fs from "fs";
import dbIndex from "../models/idx.js";

export const setLocalIndex = (sign) => {
  let data = fs.readFileSync("./index.json");
  let index;
  switch (sign) {
    case "+":
      index = JSON.parse(data).index + 1;
      break;
    case "-":
      index = JSON.parse(data).index - 1;
      break;
  }

  fs.writeFileSync("./index.json", JSON.stringify({ index }));
  return index;
};

export const setDbIndex = async (sign) => {
  let data = await dbIndex.find();
  switch (sign) {
    case "+":
      if (data.length == 0) {
        let newIdx = 1;
        const idx = new dbIndex({
          id: 1,
          index: newIdx,
        });

        await idx.save();
        return newIdx;
      } else {
        let newIdx = data[data.length - 1].index + 1;
        const idx = new dbIndex({
          id: data[data.length - 1].id + 1,
          index: newIdx,
        });

        await idx.save();
        return newIdx;
      }

    case "-":
      if (data.length == 0) {
        let newIdx = 1;
        const idx = new dbIndex({
          id: 1,
          index: newIdx,
        });

        await idx.save();
        return newIdx;
      } else {
        let newIdx = data[data.length - 1].index - 1;
        const idx = new dbIndex({
          id: data[data.length - 1].id + 1,
          index: newIdx,
        });

        await idx.save();
        return newIdx;
      }
  }
};
