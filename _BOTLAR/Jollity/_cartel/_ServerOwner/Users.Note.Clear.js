const { Client, Message, MessageEmbed, Util } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');

module.exports = {
    Isim: "nottemizle",
    Komut: ["not-temizle","notlartemizle"],
    Kullanim: "not-temizle <@munur/ID>",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!sistem._rooter.rooters.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.users.first() || message.guild.members.cache.get(args[0])
    if(!ramalcim) return message.reply({content: `${message.guild.emojiGöster(emojiler.no_munur)} Bir üye belirtmediğinden işlem iptal edildi.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    let User = await Users.findOne({_id: ramalcim.id})
    if(!User) return message.reply({content: `${message.guild.emojiGöster(emojiler.no_munur)} Belirtilen ${ramalcim} isimli üyenin veritabanında hiç bir kayıdı bulunamadı.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    if(User && !User.Notes) return message.reply({content: `${message.guild.emojiGöster(emojiler.no_munur)} Belirtilen ${ramalcim} isimli üyenin notları bulunamadı.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    if(User && User.Notes && !User.Notes.length > 0) return message.reply({content: `${message.guild.emojiGöster(emojiler.no_munur)} Belirtilen ${ramalcim} isimli üyenin notları bulunamadı.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })

    await Users.updateOne({_id: ramalcim.id}, {$unset: {"Notes": 1}}, {upsert: true})
    message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim} isimli üyenin tüm notları temizlendi.`)]}).then(async (msg) => {
        setTimeout(() => {
            msg.delete()
        }, 12000);
    })
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
};

