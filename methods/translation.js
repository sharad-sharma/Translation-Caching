const {Translate} = require('@google-cloud/translate').v2;
const fs = require('fs');

// Your Credentials
let cred = fs.readFileSync('E:\\Translation Caching\\token.json');
const CREDENTIALS = JSON.parse(cred);

// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id,
    client_email: CREDENTIALS.client_email
});

// Can be used to detect userText language
const detectLanguage = async (text) => {

    try {
        let response = await translate.detect(text);
        return response[0].language;
    } catch (error) {
        console.log(`Error at detectLanguage --> ${error}`);
        return 0;
    }
}

// Function to make API call from google translation service
const translateText = async (text, targetLanguage) => {
    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

module.exports = {
    translateText
}