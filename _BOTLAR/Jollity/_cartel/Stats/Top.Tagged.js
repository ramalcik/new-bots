const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
module.exports = {
    Isim: "toptaglı",
    Komut: ["toptaglılar"],
    Kullanim: "toptaglı",
    Aciklama: "",
    Kategori: "stat",
    Extend: ayarlar.type,
    
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
   // if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
   let load = await message.reply({content: `${message.guild.name} sunucusuna ait taglı çekme sıralaması yükleniyor. Lütfen bekleyin!`})
   let findedIndex = ''
   let data = await Users.find()
      
      let topTagli = data.filter(x => x.Taggeds).sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam2 = 0;
        ramalcim2Toplam2 = ramalcim2.Taggeds.length
        let ramalcim1Toplam2 = 0;
        ramalcim1Toplam2 = ramalcim1.Taggeds.length
        return ramalcim2Toplam2-ramalcim1Toplam2;
    }).map((m, index) => {
        let ramalcimToplam2 = 0;
        ramalcimToplam2 = m.Taggeds.length
        if(m._id == message.author.id && (index + 1) > 20) findedIndex = `\`${index+1}.\` <@${m._id}>: \` ${ramalcimToplam2} Taglı \` **(Siz)**`
        return `\`${index + 1}.\` <@${m._id}>: \` ${ramalcimToplam2} Taglı \` ${m._id == message.member.id ? `**(Siz)**` : ``}`;
    }).slice(0, 20).join('\n');
  
      load.edit({content: null, embeds: [embed.setDescription(`Aşağı da \`${message.guild.name}\` sunucusunun en iyi taglı çekenlerin sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `\`${message.guild.name}\` sunucusun da taglı bilgileri bulunamadı.`}`)]}).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 20000);
    })
 
  }
};