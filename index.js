const express = require("express");
const translationRoute = require("./routes/translation-route");
const fs = require("fs");

const app = express();
app.use(express.json())

// Set up routes
app.use("/translate", translationRoute);

app.use(express.static('public'));

// init sqlite db
const dbFile = "./data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Translation (id INTEGER PRIMARY KEY AUTOINCREMENT, userText TEXT, translatedText TEXT, userTextLanguage TEXT, translationLanguage TEXT)"
    );
    console.log("Translation cache created!");

    // insert default text
    db.serialize(() => {
      db.run(
        'INSERT INTO Translation (userText, translatedText, userTextLanguage, translationLanguage) VALUES ("Hello", "Bonjour", "en", "fr")'
      );
    });
  } else {
    console.log('Database "Translation" ready to go!');
  }
});
db.close();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App now listening for requests on port ${port}`);
});