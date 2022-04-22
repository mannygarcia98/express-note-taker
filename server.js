//Note Data
const { notes } = require("./data/db.json");

//Express
const express = require("express");
const app = express();

function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;
  if (query.id) {
    filteredResults = filteredResults.filter((note) => note.id === query.id);
  }
  return filteredResults;
}

app.get("/api/notes", (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.listen(3001, () => {
  console.log("API server now on port 3001");
});
