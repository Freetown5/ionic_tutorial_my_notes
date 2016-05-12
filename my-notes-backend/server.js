var express = require('express');
var bodyParser = require('body-parser');
var notestore = require('./notestore');

var app = express();
app.set('etag', false);
app.use(bodyParser.json());

NoteStore = notestore.create('data/notes.json');

app.get('/notes/', function(request, response) {
  response.json(NoteStore.list());
});

app.get('/notes/:noteId', function(request, response) {
  var note = NoteStore.get(request.params.noteId);
  if (note) {
    response.json(note);
  } else {
    response.status(404).send('No such note: ' + request.params.noteId);
  }
});

app.post('/notes/', function(request, response) {
  var noteId = NoteStore.create(request.body);
  response.set('Location', '/notes/' + noteId);
  response.status(201).send();
});

app.put('/notes/:noteId', function(request, response) {
  if (request.params.noteId !== request.body.id) {
    response.status(400).send('URL does not match request body');
  }
  var updated = NoteStore.update(request.body);
  if (updated) {
    response.status(204).send();
  } else {
    response.status(404).send('No such note: ' + request.params.noteId);
  }
});

app.delete('/notes/:noteId', function(request, response) {
  var deleted = NoteStore.remove(request.params.noteId);
  if (deleted) {
    response.status(204).send();
  } else {
    response.status(404).send('No such note: ' + request.params.noteId);
  }
});

var server = app.listen(8200, function() {
  console.log('Notes API listening at http://localhost:8200');
});
