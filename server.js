const fs = require("fs");
const path = require("path");
const Nanoid = require("nanoid");
//Note Data
const { notes } = require("./data/db.json");

//Express
const express = require("express");
const { dirname } = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

//Middleware
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// makes files static resources
app.use(express.static("public"));

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
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.text !== "string") {
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
  // generates unique id with nano
  req.body.id = Nanoid.nanoid(5);

  // if any data in req.body is incorrect, send 400 error back
  if (!validateNote(req.body)) {
    res.status(400).send("Note is not properly formatted.");
  } else {
    //add note to json file and notes array in this function
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  notes.map((note, index) => {
    if (note.id === id) {
      notes.splice(index, 1);
      // console.log(notes);

      return res.json(note);
    }
  });
  fs.writeFileSync(path.join(__dirname, "./data/db.json"), JSON.stringify({ notes: notes }, null, 2));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
