//Note Data
const { notes } = require("./data/db.json");

//Express
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

//Middleware
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function findById(id, notesArray) {
  const result = notesArray.filter((note) => note.id === id)[0];
  return result;
}

app.get("/api/notes", (req, res) => {
  let results = notes;
  res.json(results);
});

app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

app.post("/api/notes", (req, res) => {
  //req.body is where our incoming content will be
  console.log(req.body);
  res.json(req.body);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
