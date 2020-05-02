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
        voice: {languageCode: 'en-GB', ssmlGender: 'MALE', name:'en-GB-Wavenet-D'},
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
    participants.forEach(email => {
        const msg = {
            to: email,
            from: 'uGraduated@gmail.com',
            templateId: 'd-11f0c7665bf34b6c8df65cb92c179fdc',
            dynamic_template_data: {
                subject: 'Congratuations! uGraduated!',
                title: 'Testing Title'
            },
        };
        sgMail.send(msg).then(() => {
            console.log('Message sent')
        }).catch((error) => {
            console.log(error.response.body)
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