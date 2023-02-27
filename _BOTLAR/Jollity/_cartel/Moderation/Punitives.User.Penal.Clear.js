const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "cezalartemizle",
    Komut: ["cezalartemizle","siciltemizle","sicil-temizle"],
    Kullanim: "cezalartemizle <@munur/ID>",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
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
    if(!sistem._rooter.rooters.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let cezalar = await Punitives.findOne({Member: ramalcim.id});
    if(!cezalar) return message.reply({embeds: [new cartelinEmbedi().setDescription(`${ramalcim} isimli üyenin cezası bulunamadı.`)]});
    if(await Punitives.findOne({Member: ramalcim.id, Active: true})) return message.reply({embeds: [new cartelinEmbedi().setDescription(`${ramalcim} isimli üyenin aktif cezası bulunduğundan dolayı işlem iptal edildi.`)]});

    await message.reply({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} ${ramalcim} üyesinin tüm cezaları başarıyla temizlendi.`)]})
    await Punitives.updateMany({Member: ramalcim.id}, { $set: { Member: `Silindi (${ramalcim.id})`, No: "-99999", Remover: `Sildi (${message.author.id})`} }, { upsert: true });
    await message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
};