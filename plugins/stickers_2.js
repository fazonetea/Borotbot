/*Codded by Tahta Bot
Special Thanks:
Fazone
Sanzking
Dimasdm
Galuh
*/

const Asena = require('../events');
const {MessageType} = require('@adiwajshing/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {execFile} = require('child_process');
const cwebp = require('cwebp-bin');

const Language = require('../language');
const Lang = Language.getString('sticker');

Asena.addCommand({pattern: 'stiker', fromMe: false, remoteJid: true, deleteCommand: false, desc: Lang.STICKER_DESC}, (async (message, match) => {    
    if (message.reply_message === false) return await message.sendMessage('*Balas ke foto*');
    var downloading = await message.reply('```Mengambil stiker & menjadikannya foto...```');
    
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });

    if (message.reply_message.video === false && message.reply_message.image) {
        execFile(cwebp, [location, '-o', 'output.webp'], async err => {
            if (err) {
                throw err;
            }
        
            await message.sendMessage(fs.readFileSync('./output.webp'), MessageType.sticker);
        });
    }

    ffmpeg(location)
        .outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 512x512"])
        .save('sticker.webp')
        .on('end', async () => {
            await message.sendMessage(fs.readFileSync('sticker.webp'), MessageType.sticker);
        });
}));