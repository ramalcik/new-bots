const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

module.exports = {
    Isim: "stickeryükle",
    Komut: ["stickeroluştur", "stickerekle", "stekle", "styükle"],
    Kullanim: "stickeroluştur <[Sticker URL/Ek]> <[Sticker Adı]> <[Sticker Tagı]> <[Sticker Açıklaması]>",
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
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {

    if(!sistem._rooter.rooters.includes(message.author.id) && !message.member.permissions.has('ADMINISTRATOR') && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let url = args[0]
    let isim = args[1] 
    let tag = args[2]
    let açıklama = args.slice(3).join(" ")
    if(!url) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!isim) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!tag) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!açıklama) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    stickerOluştur(url, isim, tag, açıklama, message)
    }
};

/**
* @param {String} link 
* @param {String} ad  
* @param {String} tag 
* @param {String} açıklama
* @param {Object} message
* Sticker eklemesi için yapılan ufak bir fonksiyon.
*/


function stickerOluştur(link, ad, tag, açıklama, message) {
  message.guild.stickers.create(link, ad, tag, {description: açıklama})
  .then(sticker =>
    message.reply({embeds: [
        new cartelinEmbedi()
        .setDescription(`Başarıyla **${ad}** isimli çıkartma \`${tag}\` tagı ile oluşturuldu. ${message.guild.emojiGöster(emojiler.onay_munur)}`)
    ]})
  .then(x => {
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)  
    setTimeout(() => {
          x.delete()

      }, 7500);
  }))

  .catch(console.error);
}