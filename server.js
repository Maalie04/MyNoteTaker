const express = require('express');
const fs = require('fs');
const path = require('path');
const { clog } = require('./middleware/clog');
const { v4: uuidv4 } = require('uuid');
const { text } = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notespage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req,res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'))
}),

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title,text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
     title,
     text,
     note_id: uuidv4(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsednotes = JSON.parse(data);

        // Add a new review
        parsednotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsednotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting review');
  }
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);