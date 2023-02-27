const { Client, Message, MessageEmbed} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Kullanici = require('../../../../_SYSTEM/Databases/Schemas/Client.Users')
module.exports = {
    Isim: "topteyit",
    Komut: ["Topteyit"],
    Kullanim: "topteyit",
    Aciklama: "Sunucu genelindeki teyit sıralamasını gösterir.",
    Kategori: "teyit",
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
    let load = await message.reply({content: `${message.guild.name} sunucusuna ait teyit sıralaması yükleniyor. Lütfen bekleyin!`})
      const all = await Kullanici.find().sort();
      let findedIndex = ''
    let teyit = all.filter(m => m.Records).sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam2 = 0;
        ramalcim2Toplam2 = ramalcim2.Records.length
        let ramalcim1Toplam2 = 0;
        ramalcim1Toplam2 = ramalcim1.Records.length
        return ramalcim2Toplam2-ramalcim1Toplam2;
    })
    .map((value, index) => {
        if((index + 1) > 20 && message.author.id == value._id) findedIndex = `\`${index + 1}.\` <@${value._id}> toplam **${value.Records.filter(v => v.Gender === "Erkek").length + value.Records.filter(v => v.Gender === "Kadın").length}** üye kayıt etti. (${value.Records.filter(v => v.Gender === "Erkek").length || 0} Erkek, ${value.Records.filter(v => v.Gender === "Kadın").length || 0} Kadın)  ${value._id == message.member.id ? `**(Siz)**` : ``}`
        return `\`${index + 1}.\` <@${value._id}> toplam **${value.Records.filter(v => v.Gender === "Erkek").length + value.Records.filter(v => v.Gender === "Kadın").length}** üye kayıt etti. (${value.Records.filter(v => v.Gender === "Erkek").length || 0} Erkek, ${value.Records.filter(v => v.Gender === "Kadın").length || 0} Kadın)  ${value._id == message.member.id ? `**(Siz)**` : ``}`
    }).slice(0, 20)

    load.edit({content: null, embeds: [new cartelinEmbedi().setDescription(`Aşağı da **${message.guild.name}** sunucusunun en iyi kayıt yapanların sıralaması belirtilmiştir.\n\n${teyit.join("\n") + `\n${findedIndex}` || `${cevaplar.prefix} ${message.guild.name} Sunucusun da teyit bilgileri bulunamadı.`}`)]}).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 20000);
      })
    }
};
