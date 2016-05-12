var fs = require('fs');
var crypto = require('crypto');

function create(fileName) {
  var notes = JSON.parse(fs.readFileSync(fileName));

  function persist(notes) {
    fs.writeFile(fileName, JSON.stringify(notes));
  }

  return {
    list: function() {
      return notes;
    },
    get: function(noteId) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === noteId) {
          return notes[i];
        }
      }
      console.log('No such note: ' + noteId);
    },
    create: function(note) {
      var noteId = crypto.randomBytes(4).toString('hex');
      notes.push({
        id: noteId,
        title: note.title,
        description: note.description
      });
      persist(notes);
      return noteId;
    },
    update: function(note) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === note.id) {
          notes[i] = note;
          persist(notes);
          return true;
        }
      }
      return false;
    },
    remove: function(noteId) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === noteId) {
          notes.splice(i, 1);
          persist(notes);
          return true;
        }
      }
      return false;
    }
  };
}

exports.create = create;
