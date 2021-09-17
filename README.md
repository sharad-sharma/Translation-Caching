# Translation-Caching

A web server with a RESTful API to translate a text from one language to another.
In order to avoid repeated hits to the translation API, I am using sqlite3 to cache data.


## Installation

```
$ git clone https://github.com/sharad-sharma/Translation-Caching.git
$ cd Translation-Caching
$ npm install
```

After installing the project
  * Create a service account on google cloud translation API.
  * Create KEYS and download JSON file of tokens.
  * Paste that token file in the project folder.
  * Specify the location of token.json in translation.js on line no. 5.


## Documentation

```
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"userText":"Hello","userTextLanguage":"en","translationLanguage":"ja"});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:5000/translate/work", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

Make a POST request with specified fields in body of the request
  * userText --> The text you want to translate
  * userTextLanguage --> The language of userText (This field is optional)
  * TranslationLanguage --> The language you want userText to translate into

The API will return translated text as the response.
  
## Cache database schema

Cache is implemented in SQLite3.
```
CREATE TABLE Translation
(
id INTEGER PRIMARY KEY AUTOINCREMENT,
userText TEXT,
translatedText TEXT,
userTextLanguage TEXT,
translationLanguage TEXT
);
```

## Testing

Testing is done using JavaScript testing framework **JEST**

* Fully tested on the capabilities to translate one language to the valid language.
* Fully tested the caching system.

##### To run testing:
```
npm test --detectOpenHandles
```

## Resources

Make sure you are using valid language codes, refer to [https://cloud.google.com/translate/docs/languages]
