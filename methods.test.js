const express = require("express");
const app = express();
const request = require("supertest")

const { translateText } = require("./methods/translation");

// init sqlite db
const dbFile = "./data/sqlite.db";
const sqlite3 = require("sqlite3");
const { open } = require('sqlite');

const dbConnection = open({
    filename: dbFile,
    driver: sqlite3.Database
})

const findFromCache = async (userText, userTextLanguage, translationLanguage) => {
  const db = await dbConnection;
  const row = await db.get(
      'SELECT * FROM Translation WHERE userText = ? AND userTextLanguage = ? AND translationLanguage = ?', [userText, userTextLanguage, translationLanguage]);

  db.close();

  if(row == null) return 'abc';
  else return row.translatedText;
}

// Testing on new words which are not already cached
// NOTE: It is not pushing the results into cache
//       It is just to test translation function
test('Translate POST request', async() => {
    const userinput = {
      "userText": "Hello",
      "userTextLanguage": "en",
      "translationLanguage": "ja"
    };
    let translatedText = await translateText(userinput.userText, userinput.translationLanguage);
    expect(translatedText).toBe('こんにちは');
  }
)

// Cached text of previous requests
test('Returning from cache', async() => {
  const translatedText = await findFromCache("Hello", "en", "ja");
  expect(translatedText).toBe('こんにちは');
})