import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 8081;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.static("images"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.setHeader("Access-Control-ALlow-Headers", "Content-Type");

  next();
});

app.get("/user-found-longdogs", async (req, res) => {
  const fileData = await fs.readFile("./data/user-found-longdogs.json");
  const longDogs = JSON.parse(fileData);
  res.status(200).json({ longDogs });
});

app.post("/user-found-longdogs", upload.single("image"), async (req, res) => {
  res.status(200).json({ message: "Found long dog added!" });
});

app.put("/user-found-longdogs", async (req, res) => {
  const longDogs = req.body.allFoundLongDogs;

  await fs.writeFile(
    "./data/user-found-longdogs.json",
    JSON.stringify(longDogs)
  );

  res.status(200).json({ message: "Found long dog added!" });
});

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  res.status(404).json({ message: "404 - Not Found" });
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
