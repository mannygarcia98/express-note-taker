const fs = require("fs");
const path = require("path");

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

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(path.join(__dirname, "./data/db.json"), JSON.stringify({ notes: notesArray }, null, 2));
  return note;
}

function validateNote(note) {
  if (!note.title || typeof note.name !== "string") {
    return false;
  }
  if (!note.content || typeof note.content !== "string") {
    return false;
  }
  return true;
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
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateNote(req.body)) {
    res.status(400).send("Note is not properly formatted.");
  } else {
    //add note to json file and notes array in this function
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
