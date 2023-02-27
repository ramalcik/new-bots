const { Client, Message, MessageEmbed} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Coins = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
module.exports = {
    Isim: "addbalance",
    Komut: ["baladd","bal-add","balla","coinekle"],
    Kullanim: "addbalance <Altın/Para> <@munur/ID> <Miktar>",
    Aciklama: "",
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
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    let embed = new cartelinEmbedi()
    let ramalcim = message.guild.members.cache.get(message.member.id);
    let Coin = 0
    if(!sistem._rooter.rooters.includes(message.member.id)) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!args[0]) return message.reply(`${cevaplar.prefix} Lütfen hangi birimden göndereceğini belirt. (Örn: \`${sistem.botSettings.Prefixs[0]}addbalance <Altın/Para> <@munur/ID> <Miktar>\` )`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    if(args[0] == "Para" || args[0] == "para") {
        Coin = await client.Economy.viewBalance(ramalcim.id, 1)
        let Gönderilen = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if(!Gönderilen) return message.reply(`${cevaplar.prefix} Göndermek istediğiniz bi üyeyi belirtin.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        let Miktar = Number(args[2]);
        if(isNaN(Miktar)) return message.reply(`${cevaplar.prefix} Göndermek istediğiniz miktarı rakam olarak girin.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        Miktar = Miktar.toFixed(0);
        if(Miktar <= 0) return message.reply(`${cevaplar.prefix} Gönderilen rakam birden küçük veya sıfır olamaz.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        await client.Economy.updateBalance(Gönderilen.id, Miktar, "add", 1)
        await Coins.updateOne({_id: Gönderilen.id}, { $push: { "Transfers": { ramalcim: ramalcim.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Havadan Gelen Para" } }}, {upsert: true})
        await message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
        await message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} ${Gönderilen} üyesine başarıyla \`${Miktar}\` ${ayarlar.serverName} Parası gönderdin.`)]})
        return;
    } else if(args[0] == "Altın" || args[0] == "altın") {
        Coin = await client.Economy.viewBalance(ramalcim.id, 0)
        let Gönderilen = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if(!Gönderilen) return message.reply(`${cevaplar.prefix} Göndermek istediğiniz bi üyeyi belirtin.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        let Miktar = Number(args[2]);
        if(isNaN(Miktar)) return message.reply(`${cevaplar.prefix} Göndermek istediğiniz miktarı rakam olarak girin.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        Miktar = Miktar.toFixed(0);
        if(Miktar <= 0) return message.reply(`${cevaplar.prefix} Gönderilen rakam birden küçük veya sıfır olamaz.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        await client.Economy.updateBalance(Gönderilen.id, Miktar, "add", 0)
        await Coins.updateOne({_id: Gönderilen.id}, { $push: { "Transfers": { ramalcim: ramalcim.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Havadan Gelen Altın" } }}, {upsert: true})
        await message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
        await message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} ${Gönderilen} üyesine başarıyla \`${Miktar}\` ${message.guild.emojiGöster(emojiler.Görev.Altın)} gönderdin.`)]})
        return;
    
    }
    return message.reply(`${cevaplar.prefix} Lütfen hangi birimden göndereceğini belirt. (Örn: \`${sistem.botSettings.Prefixs[0]}addbalance <Altın/Para> <@munur/ID> <Miktar>\` )`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
  }
};