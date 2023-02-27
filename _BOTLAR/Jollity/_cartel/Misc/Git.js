const { Client, Message, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "git",
    Komut: ["git", "izinligit"],
    Kullanim: "izinligit @munur/ID",
    Aciklama: "Belirlenen üyeye izin ile yanına gider.",
    Kategori: "diğer",
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
    let embed = new cartelinEmbedi()
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!message.member.voice.channel) return message.reply(`${cevaplar.prefix} Bir ses kanalında olman lazım.`).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (!ramalcim) return message.reply(`${cevaplar.prefix} Bir üye belirtmelisin.`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.id === ramalcim.id) return message.reply(`${cevaplar.prefix} Kendinin yanına da gitmezsin!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.voice.channel === ramalcim.voice.channel) return message.reply(`${cevaplar.prefix} Belirttiğin üyeyle aynı kanaldasın!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (!member.voice.channel) return message.reply(`${cevaplar.prefix} Belirtilen üye herhangi bir ses kanalında değil!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (ramalcim.user.bot) return message.reply(cevaplar.bot).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (message.member.permissions.has('ADMINISTRATOR') || roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) {
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
        await message.member.voice.setChannel(ramalcim.voice.channel.id).catch(err => {})
        return message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} ${message.member} isimli yetkili ${ramalcim} (\`${ramalcim.voice.channel.name}\`) isimli üyenin odasına gitti!`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
        }, 7500))
    }
    let Row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("kabulet")
        .setLabel("Kabul Et")
        .setEmoji(message.guild.emojiGöster(emojiler.onay_munur))
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("reddet")
        .setLabel("Reddet")
        .setEmoji(message.guild.emojiGöster(emojiler.no_munur))
        .setStyle("DANGER")
    )   
    
    message.channel.send({content: `${ramalcim.toString()}`, embeds: [embed.setDescription(`${ramalcim}, ${message.author} adlı üye \`${ramalcim.voice.channel.name}\` adlı odanıza gelmek istiyor.\nKabul ediyor musun?`)], components: [Row]}).then(async (msg) => {
        var filter = (i) => i.user.id == ramalcim.id
        let collector = msg.createMessageComponentCollector({filter: filter, time: 30000})

        collector.on('collect', async (i) => {
            if(i.customId == "kabulet") {
                await i.deferUpdate().catch(err => {})
                await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} ${message.author}, ${ramalcim} isimli üye senin odaya gelme isteğini kabul etti.`)], components: []}).catch(err => {})
                await message.member.voice.setChannel(ramalcim.voice.channel.id).catch(err => {})
                message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
                setTimeout(() => {
                    msg.delete().catch(err => {})
                }, 12000);
            }
            if(i.customId == "reddet") {
                await i.deferUpdate().catch(err => {})
                await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.no_munur)} ${message.author}, ${ramalcim} isimli üye senin odaya gelme isteğini reddetti!`)], components: []}).catch(err => {})
                message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined).catch(err => {})
                setTimeout(() => {
                    msg.delete().catch(err => {})
                }, 12000);
            }
        })
        collector.on('end', async (i) => {
            i.delete()
            let RowTwo = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("kabulet")
                .setLabel("Zaman Aşımı!")
                .setEmoji(message.guild.emojiGöster(emojiler.no_munur))
                .setStyle("SECONDARY")
                .setDisabled(true),
            )  
            await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.no_munur)} ${message.author}, ${ramalcim} isimli üye tepki vermediğinden dolayı işlem iptal edildi.`)], components: [RowTwo]}).catch(err => {})
            setTimeout(() => {
                msg.delete().catch(err => {})
            }, 12000);
        })
    })

    }
};