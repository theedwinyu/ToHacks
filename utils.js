const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient();
const language = require('@google-cloud/language');
const Filter = require('bad-words');
const sgMail = require('@sendgrid/mail');

hasProfanity = (text) => {
    const filter = new Filter(); 
    return filter.isProfane(text);
} 

getTTS = async (text) => {
    const request = {
        input: {text: text},
        voice: {languageCode: 'en-US', ssmlGender: 'MALE', name:'en-US-Wavenet-D'},
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
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("key: ", process.env.SENDGRID_API_KEY);
    participants.forEach(x => {
        const msg = {
            to: x.email,
            from: 'uGraduated@gmail.com',
            templateId: 'd-c6861d28111a4fb892652fa95532eee3',
            dynamic_template_data: {
                subject: `Congratuations ${x.name}! uGraduated!`,
                name: x.name,
            },
        };
        sgMail.send(msg).then(() => {
            console.log('Message sent')
        }).catch((error) => {
            console.log(JSON.stringify(error))
        })
    })
    return true;
}

module.exports = {
    getTTS: getTTS,
    checkSentiment: checkSentiment,
    hasProfanity: hasProfanity,
    sendEmails: sendEmails,
}