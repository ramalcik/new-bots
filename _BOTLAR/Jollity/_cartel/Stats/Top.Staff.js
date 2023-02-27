const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
module.exports = {
  Isim: "topyetkili",
  Komut: ["topyetkililer"],
  Kullanim: "topyetkili",
  Aciklama: "",
  Kategori: "stat",
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
    let load = await message.reply({content: `${message.guild.name} sunucusuna ait yetkili çekme sıralaması yükleniyor. Lütfen bekleyin!`})
    let embed = new cartelinEmbedi()
    let findedIndex = ''
    let data = await Users.find()
      let topTagli = data.filter(x => x.Staffs).sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam2 = 0;
        ramalcim2Toplam2 = ramalcim2.Staffs.length
        let ramalcim1Toplam2 = 0;
        ramalcim1Toplam2 = ramalcim1.Staffs.length
        return ramalcim2Toplam2-ramalcim1Toplam2;
    }).map((m, index) => {
        let ramalcimToplam2 = 0;
        ramalcimToplam2 = m.Staffs.length
        if(m._id == message.author.id && (index + 1) > 20) findedIndex = `\`${index+1}.\` <@${m._id}>: \` ${ramalcimToplam2} Yetkili \` **(Siz)**`
        return `\`${index + 1}.\` <@${m._id}>: \` ${ramalcimToplam2} Yetkili \` ${m._id == message.member.id ? `**(Siz)**` : ``}`;
    }).slice(0, 20).join('\n');

    load.edit({content: null, embeds: [embed.setDescription(`Aşağı da **${message.guild.name}** sunucusunun en iyi yetki çekenlerin sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `${cevaplar.prefix} ${message.guild.name} Sunucusun da yetkili bilgileri bulunamadı.`}`)]}).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 20000);
    })
  
  }
};

