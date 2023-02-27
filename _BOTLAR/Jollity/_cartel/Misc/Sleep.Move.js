const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

module.exports = {
    Isim: "sleep",
    Komut: ["sleep","sleeptaşı","sleep-taşı"],
    Kullanim: "sleep",
    Aciklama: "",
    Kategori: "yönetim",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {

    if(!sistem._rooter.rooters.includes(message.member.id) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let voiceChannel = message.member.voice.channelId;
    if (!voiceChannel && !args[0]) return message.reply(`${cevaplar.prefix} Ses kanalında olmadığın için işlem iptal edildi.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(ramalcim) {
         if(!ramalcim.voice.channel) return message.reply(`${message.guild.emojiGöster(emojiler.no_munur)} Belirtilen **${ramalcim.user.tag}** isimli üye seste aktif olmadığından işlem iptal edildi.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 8500);
        });
       await ramalcim.voice.setChannel(kanallar.sleepRoom)
       return message.reply(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla! ${ramalcim} isimli üye ${message.guild.channels.cache.get(kanallar.sleepRoom)} kanalına taşındı!`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 8500);
    });
    } else {
        let ramalcimler = message.member.voice.channel.members.filter(x => x.voice.selfDeaf || x.voice.selfMute)
        if(ramalcimler.size <= 0) return message.reply(`${message.guild.emojiGöster(emojiler.serverTag)} Bulunduğun odada kulaklığı veya mikrofonu kapalı üye bulunamadı.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 8500);
        });
        
        message.member.voice.channel.members.array().filter(x => x.voice.selfDeaf || x.voice.selfMute).forEach((m, index) => {
        setTimeout(() => {
            m.voice.setChannel(kanallar.sleepRoom);
        }, index*1000);
        });
        message.reply(`${message.guild.emojiGöster(emojiler.onay_munur)} Bulunduğun ${message.member.voice.channel} adlı ses kanalında kulaklığı veya mikrofonu kapalı olan ${ramalcimler.size} üyeyi(leri) ${message.guild.channels.cache.get(kanallar.sleepRoom)} kanalına taşıdım.`).then(x => {
            setTimeout(() => {
                x.delete()
            }, 8500);
        });
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
  }
}