const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");
const Unleash = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "sonyetki",
    Komut: ["son-yetkisi","sonrolleri","sonroller","yetkibırakan"],
    Kullanim: "yetkibırakan <@munur/ID>",
    Aciklama: "Belirlenen üyeyi yetkiye davet etmek için istek gönderirsin.",
    Kategori: "yönetim",
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
        if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let data = await Unleash.findOne({_id: ramalcim.id})
        if(!data) return message.reply(cevaplar.data).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        message.channel.send({embeds: [new cartelinEmbedi().setFooter("bu görüntüleme ektedir.").setTimestamp().setDescription(`:tada: ${ramalcim} isimli eski yetkili üyenin eski rolleri aşağıda belirtilmiştir.\n
**Rolleri Şunlardır**:\n${data ? data.unleashRoles.map(x => `\` • \` ${message.guild.roles.cache.get(x)} (\`${x}\`)`).join("\n") : `${message.guild.emojiGöster(emojiler.onay_munur)} Veritabanına bir rol veya bir veri bulunamadı!`}`)]})

    }
};