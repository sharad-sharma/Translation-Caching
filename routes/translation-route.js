const router = require("express").Router();
const { translateText } = require("../methods/translation"); 

// init sqlite db
const dbFile = "./data/sqlite.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// POST request @(/translate/work), it will return translated text as a response
router.post('/work', (req, res) => {
  try {
    db.serialize(() => {
      db.get(
        'SELECT * FROM Translation WHERE userText = ? AND userTextLanguage = ? AND translationLanguage = ?', [req.body.userText, req.body.userTextLanguage, req.body.translationLanguage], (err, row) => {
          if(err) {
            return console.log(err);
          }
  
          // If this translation is not already cached, we need to make new API call
          if(row == null) {
  
            // Make API call here
            let result_translation = "This is the resultant translation";
            translateText(req.body.userText, req.body.translationLanguage)
              .then(data => {
                result_translation = data;
  
                // Add this to the cache
                addData(req.body.userText, result_translation, req.body.userTextLanguage, req.body.translationLanguage);
  
                // Return response to the user
                res.send(result_translation);
  
              })
              .catch(err => {
                console.log(err);
              })
  
          } else {
            // We can directly return previously cached translation.
            res.send(row.translatedText);
          }
        }
      )
    })

  } catch (err) {
    console.log(err);
  }
  
})

// POST request to add translated texts manually
router.post('/add', (req, res) => {
  addData(req.body.userText, req.body.translatedText, req.body.userTextLanguage, req.body.translationLanguage);
  res.send("Items successfully added");
})

// Function to add data to the table
const addData = (userText, translatedText, userTextLanguage, translationLanguage) => {
  db.serialize(() => {
    db.run(
      'INSERT INTO Translation (userText, translatedText, userTextLanguage, translationLanguage) VALUES (?, ?, ?, ?)', [userText, translatedText, userTextLanguage, translationLanguage]
    )
  })
}

module.exports = router;
