const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");
const Upstaff = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Staffs');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "yetkiçek",
    Komut: ["yçek","ytçek","yetkicek","ycek"],
    Kullanim: "yetkiçek <@munur/ID>",
    Aciklama: "Belirlenen üyeyi komutu kullanan üyenin taglısı olarak belirler.",
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
    let embed = new cartelinEmbedi()
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let kontrol = await Users.findOne({_id: ramalcim.id}) || { Staff: false }
    if(kontrol && kontrol.Staff) ramalcim.removeStaff(ramalcim.roles.cache, true)
    await Users.updateOne({ _id: ramalcim.id }, { $push: { "StaffLogs": {
      Date: Date.now(),
      Process: "ÇEKİLDİ",
      Role: ramalcim.roles.hoist ? ramalcim.roles.hoist.id : roller.başlangıçYetki,
      Author: message.member.id
    }}}, { upsert: true }) 
    let altYetki = message.guild.roles.cache.get(roller.altilkyetki)
    if(altYetki) await ramalcim.roles.remove(ramalcim.roles.cache.filter(rol => altYetki.position <= rol.position))
    let yetkiliLog = message.guild.kanalBul("yetki-çek-log")
    if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${message.author} isimli yetkili ${ramalcim.toString()} isimli üyenin \`${tarihsel(Date.now())}\` tarihinde yetkisini aldı!`)]})
     message.reply({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim.toString()} isimli üyenin yetkisi alındı.`)]})
    .then(x => {
      message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
      setTimeout(() => {
        x.delete()
      }, 7500);
    }) 
    
    }
};