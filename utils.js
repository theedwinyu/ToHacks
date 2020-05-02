const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient();
const language = require('@google-cloud/language');
const Filter = require('bad-words'),

hasProfanity = (text) => {
    const filter = new Filter(); 
    return filter.isProfane(text);
} 

getTTS = async (text) => {
    const request = {
        input: {text: text},
        voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
        audioConfig: {audioEncoding: 'MP3'},
    };

    const [response] = await client.synthesizeSpeech(request);

    return response.audioContent;
}

checkSentiment = async (text) => {

    const client = new language.LanguageServiceClient();

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    const [result] = await client.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;

    return sentiment;
}

sendEmails = (participants) => {
    console.log(participants);
    return true;
}

module.exports = {
    getTTS: getTTS,
    checkSentiment: checkSentiment,
    hasProfanity: hasProfanity,
    sendEmails: sendEmails,
}