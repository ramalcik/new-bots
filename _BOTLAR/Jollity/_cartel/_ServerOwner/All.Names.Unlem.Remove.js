const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

module.exports = {
    Isim: "ünlemkaldır",
    Komut: ["unlemkaldır", "isim-ünlemtemizle", "unlemkaldir", "ümlemlerikaldır"],
    Kullanim: "ünlemkaldır",
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
    let ünlemliler = message.guild.members.cache.filter(x => x.displayName.includes("!"))
    ünlemliler.forEach(async (ramalcim) => {
       await ramalcim.setNickname(ramalcim.displayName.replace("!","")).catch(err => {})
       if(ramalcim.displayName.includes(".")) await ramalcim.setNickname(ramalcim.displayName.replace(".","")).catch(err => {})
    })
    message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla \`${ünlemliler.size}\` üyenin isminde ki __ünlem, özel karakter veya boşluk__ kaldırıldı.`)]}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 17500);
    })
} 
};

