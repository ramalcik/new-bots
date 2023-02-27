const { Client, Message, MessageEmbed} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Kullanici = require('../../../../_SYSTEM/Databases/Schemas/Client.Users')
module.exports = {
    Isim: "toptakipçi",
    Komut: ["toptakip","topfollow"],
    Kullanim: "toptakip",
    Aciklama: "Sunucu genelindeki teyit sıralamasını gösterir.",
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
    let load = await message.reply({content: `${message.guild.name} sunucusuna ait takipçi sıralaması yükleniyor. Lütfen bekleyin!`})
        const all = await Kullanici.find().sort();
    let teyit = all.filter(m => message.guild.members.cache.has(m._id) && m.Follower).sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam2 = 0;
        ramalcim2Toplam2 = ramalcim2.Follower.length
        let ramalcim1Toplam2 = 0;
        ramalcim1Toplam2 = ramalcim1.Follower.length
        return ramalcim2Toplam2-ramalcim1Toplam2;
    })
    .slice(0, 20)
    .map((value, index) => `\` ${index == 0 ? `👑` : index+1} \` ${value._id ? message.guild.members.cache.get(value._id) ? message.guild.members.cache.get(value._id) : `<@${value._id}>` : `<@${value._id}>`} (takipçi \`${value.Follower ? value.Follower.length : 0}\`, arkadaş \`${value.Friends ? value.Friends.length : 0}\`, beğeni \`${value.Likes ? value.Likes.length : 0}\`, görüntülenme \`${value.Views || 0}\`)  ${value._id == message.member.id ? `**(Siz)**` : ``}`)
    let findedIndex = ''
    let tqeqweyit = all.filter(m => message.guild.members.cache.has(m._id) && m.Follower).sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam2 = 0;
        ramalcim2Toplam2 = ramalcim2.Follower.length
        let ramalcim1Toplam2 = 0;
        ramalcim1Toplam2 = ramalcim1.Follower.length
        return ramalcim2Toplam2-ramalcim1Toplam2;
    }).map((value, index) => {
        let geneltoplamkayıtlar = value.Follower.length
        let sira = ``
        if(value._id === message.member.id) sira = `${index + 1}`
        if(value._id === message.member.id) {
            if(geneltoplamkayıtlar != 0 && sira > 20) return findedIndex = `\` ${sira} \` ${message.guild.members.cache.get(value._id).toString()}  (takipçi \`${geneltoplamkayıtlar}\`, arkadaş \`${value.Friends ? value.Friends.length : 0}\`, beğeni \`${value.Likes ? value.Likes.length : 0}\`, görüntülenme \`${value.Views || 0}\`) **(Siz)**`
        }
        
    })
    load.edit({content: null,embeds: [new cartelinEmbedi().setDescription(`Aşağı da **${message.guild.name}** sunucusunun en fazla takipçiye sahip üyeler listelenmektedir.\n\n${teyit.join("\n") + `\n${findedIndex}` || `${cevaplar.prefix} ${message.guild.name} Sunucusun da takipçi bilgileri bulunamadı.`}`)]}).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 20000);
      })
    }
};
