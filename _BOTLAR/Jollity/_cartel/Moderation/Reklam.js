const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Jail = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Jails')
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const getLimit = new Map();
module.exports = {
    Isim: "reklam",
    Komut: ["ads","reklam-cezalandır"],
    Kullanim: "reklam <@munur/ID>",
    Aciklama: "Belirtilen üyeyi cezalandırır.",
    Kategori: "yetkili",
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
    if(!roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let jailButton = new MessageButton()
    .setCustomId(`onayla`)
    .setLabel(await Jail.findById(ramalcim.id) ? `Aktif Cezalandırılması Mevcut!` : getLimit.get(message.member.id) >= ayarlar.reklamLimit ? `Limit Doldu (${getLimit.get(message.member.id) || 0} / ${ayarlar.reklamLimit})` : 'Cezalandırmayı Onaylıyorum!')
    .setEmoji(message.guild.emojiGöster(emojiler.Cezalandırıldı))
    .setStyle('SECONDARY')
    .setDisabled(await Jail.findById(ramalcim.id) ? true : getLimit.get(message.member.id) >= ayarlar.reklamLimit ? true : false )
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('İşlemi İptal Et')
    .setEmoji(message.guild.emojiGöster(emojiler.no_munur))
    .setStyle('DANGER')
    let jailOptions = new MessageActionRow().addComponents(
            jailButton,
            iptalButton
    );

    let msg = await message.reply({content: `Belirtilen ${ramalcim} isimli üyeyi reklam gerekçesiyle kalıcı bir şekilde cezalandırmak istiyor musun?`, components: [jailOptions]}).catch(err => {})

    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })

    collector.on('collect', async i => {
        if (i.customId === `onayla`) {
            i.deferUpdate()  
            msg.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
            ramalcim.removeStaff()
            ramalcim.dangerRegistrant()
            if(Number(ayarlar.reklamLimit)) {
                if(!message.member.permissions.has('ADMINISTRATOR') && !sistem._rooter.rooters.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
                    getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
                    setTimeout(() => {
                        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
                    },1000*60*5)
                }
            }
            return ramalcim.addPunitives(3, message.member, "Sunucu içerisinde reklam yapmak!", message)

            }
        if (i.customId === `iptal`) {
            return await i.update({ content: `${message.guild.emojiGöster(emojiler.no_munur)} ${ramalcim} isimli üyenin cezalandırılma işlemi başarıyla iptal edildi.`, components: [], embeds: [] });
        }
    });
    collector.on("end", async i => {
        msg.delete().catch(err => {})
    })

    }
};

