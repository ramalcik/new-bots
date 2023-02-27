const { Client, Message, MessageEmbed} = require("discord.js");
const Invite = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Staffs');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "topgörev",
    Komut: ["toptasks","top-görev","top-tasks","topgorev"],
    Kullanim: "topgörev",
    Aciklama: "Sunucu içerisindeki tüm davet sıralaması görüntülenir",
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
    let load = await message.reply({content: `${message.guild.name} sunucusuna ait görev puanı sıralaması yükleniyor. Lütfen bekleyin!`})
    let embed = new cartelinEmbedi()
    let data = await Invite.find()
      
     
      let topTagli = data.filter(x => x.Görev).sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam2 = 0;
        ramalcim2Toplam2 = ramalcim2.Görev
        let ramalcim1Toplam2 = 0;
        ramalcim1Toplam2 = ramalcim1.Görev
        return ramalcim2Toplam2-ramalcim1Toplam2;
    }).map((m, index) => {
        let ramalcimToplam2 = 0;
        ramalcimToplam2 = m.Görev
          if(m._id == message.author.id && (index + 1) > 20) findedIndex = `\`${index+1}.\` <@${m._id}>: **\`${ramalcimToplam2} Görev Puanı\`** **(Siz)**`
        return `\`${index + 1}.\` <@${m._id}>: **\`${ramalcimToplam2} Görev Puanı\`** ${m._id == message.member.id ? `**(Siz)**` : ``}`;
    }).slice(0, 20).join('\n');

    load.edit({content: null, embeds: [embed.setDescription(`Aşağı da **${message.guild.name}** sunucusunun en iyi görev yapanların sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `${cevaplar.prefix} ${message.guild.name} Sunucusunda da görev sıralama bilgileri bulunamadı.`}`)]}).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 20000);
      })


    }
};