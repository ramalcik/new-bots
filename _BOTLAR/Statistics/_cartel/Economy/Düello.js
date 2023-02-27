const { Client, Message } = Discord = require("discord.js");
const util = require("util")
const Game = require('../../../../_SYSTEM/Additions/Economy/_games/Fight')
module.exports = {
    Isim: "düello",
    Komut: ["vs","duello","kapış"],
    Kullanim: "düello <@munur/ID> <Miktar>",
    Aciklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
    Kategori: "eco",
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
    if(!kanallar.coinChat.some(x => message.channel.id == x) && !sistem._rooter.rooters.includes(message.member.id)) return message.reply(`${cevaplar.prefix} Sadece ${kanallar.coinChat.map(x => message.guild.channels.cache.get(x)).join(",")} kanalların da oynayabilirsin.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {x.delete()}, 5000)
    })
      let ramalcim = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
      if (!ramalcim) return message.reply(`${cevaplar.prefix} Savaşmak istediğiniz bir üyeyi belirtin!`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    if (ramalcim.id === message.author.id) return message.reply(`${cevaplar.prefix} Kendi pipinle oynayamazsın :)`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    ramalcim = message.guild.members.cache.get(ramalcim.id)
        if (!args[1]) return message.reply(`${cevaplar.prefix} Lütfen bir miktar belirtin aksi taktirde oyuna başlayamazsınız.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        if (args[1] <= 0) returnmessage.reply(`${cevaplar.prefix} Girdiğiniz miktar lütfen sıfırdan büyük olmalıdır.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
      let data_1 = await client.Economy.viewBalance(message.member.id, 1)
      let data_2 = await client.Economy.viewBalance(ramalcim.id, 1)
      if (data_1 > args[1] && data_2 > args[1]) { 
        await Game({
            message: message,
            opponent: ramalcim,
            ödül: args[1] * 2,
            bahis: args[1],
            parabirim: ayarlar.serverName,
            embed: {
                title: 'munur',
                color: 'YELLOW',
                footer: 'munur',
                timestamp: false
            },
            buttons: {
              hit: 'Saldırı',
              heal: 'Savun & İyileş',
              cancel: 'Savaştan Çekil',
              accept: 'Kabul Et',
              deny: 'Kabul Etme'
            },
            acceptMessage: `<@{{opponent}}> Merhaba Savaşçı!\n\n<@{{challenger}}> isimli üye seni \`${args[1]} ${ayarlar.serverName} Parası\` değerinde düello kapışması isteği gönderdi, kabul etmek istiyorsan **hemen tıkla**!`,
            winMessage: `Savaş sona erdi, savaşın kazananı <@{{winner}}> oldu!\nSavaştan tam tamına "${args[1] * 2} ${ayarlar.serverName}" Parası değerinde ganimet kazandı!`,
            endMessage: '<@{{opponent}}> zamanında cevap vermedi. Oyun bitirildi!',
            cancelMessage: '<@{{opponent}}> savaş iptal edildi!',
            fightMessage: '{{player}} üyesi başlayacak!',
            opponentsTurnMessage: 'Düşmanının hamlesini beklemelisin!',
            highHealthMessage: 'Savun ve iyileşmek için çok erken!',
            lowHealthMessage: 'Artık savaştan kaçmak için çok geç!',
            returnWinner: false,
            othersMessage: 'Sadece {{author}} üye(ler) kullanabilir!'
        });
      } else return message.reply(`${cevaplar.prefix} Belirtiğiniz üyenin veya sizin belirttiğiniz miktarda parası bulunamadı.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
}
};