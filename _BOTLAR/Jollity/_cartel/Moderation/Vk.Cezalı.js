const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const {VK, DC, STREAM} = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Activitys');
module.exports = {
    Isim: "vkcezalı",
    Komut: ["vkcezali","vk-cezali","vk-cezalı","vkc"],
    Kullanim: "vkcezalı <@munur/ID>",
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
    if(!ayarlar && !roller && !roller.vkCezalıRolü) return message.reply(cevaplar.notSetup)
    let aktivite = "Vampir Köylü"
    if(!roller.vkSorumlusu.some(oku => message.member.roles.cache.has(oku)) && !roller.sorunÇözmeciler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const sebeps = [
        { label: "Kışkırtma, Trol ve Dalgacı Davranış", description: "3 Gün", emoji: {name: "1️⃣"} , value: "1", date: "3d", type: 10},
        { label: "Karşı Cinse Taciz Ve Rahatsız Edici Davranış", description: "7 Gün", emoji: {name: "2️⃣"} ,value: "2", date: "7d", type: 10},
        { label: `Ortamı (${ayarlar.serverName}) Kötülemek`, description: "5 Gün", emoji: {name: "3️⃣"} ,value: "3", date: "5d", type: 10},
        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "1 Gün", emoji: {name: "4️⃣"} ,value: "4", date: "1d", type: 10},
        { label: "Dini, Irki ve Siyasi değerlere Hakaret", description: "10 Gün", emoji: {name: "5️⃣"} ,value: "5", date: "10d", type: 10},
        { label: "Etkinliği Sabote Edicek Şekilde Davranmak", description: "3 Gün", emoji: {name: "6️⃣"}, value: "6", date: "3d", type: 10},
    ]
    let jailButton = new MessageButton()
    .setCustomId(`onayla`)
    .setLabel(await VK.findById(ramalcim.id) ? `Aktif Cezalandırılması Mevcut!` : 'Cezalandırmayı Onaylıyorum!')
    .setEmoji(message.guild.emojiGöster(emojiler.Cezalandırıldı))
    .setStyle('SECONDARY')
    .setDisabled(await VK.findById(ramalcim.id) ? true : false )
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('İşlemi İptal Et')
    .setEmoji(message.guild.emojiGöster(emojiler.no_munur))
    .setStyle('DANGER')
    let jailOptions = new MessageActionRow().addComponents(
            jailButton,
            iptalButton
    );

    let msg = await message.channel.send({embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.displayAvatarURL({dynamic: true})).setDescription(`Belirtilen ${ramalcim} isimli üyeyi **${aktivite}** etkinliğinden cezalandırmak istiyor musun?`)], components: [jailOptions]}).catch(err => {})

    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })

    collector.on('collect', async i => {
        if (i.customId === `onayla`) {
            i.update({embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.displayAvatarURL({dynamic: true})).setDescription(`Belirlenen ${ramalcim} isimli üyesini hangi sebep ile **${aktivite}** etkinliğinden cezalandırmak istiyorsun?`)], components: [new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId(`sebep`)
                .setPlaceholder(`${ramalcim.user.tag} için ceza sebebi belirtin!`)
                .addOptions([
                    sebeps.filter(x => x.type == 10)
                ]),
            )]})
            }
        if (i.customId === `sebep`) {
           let seçilenSebep = sebeps.find(x => x.value == i.values[0])
           if(seçilenSebep) {
                i.deferUpdate()  
                msg.delete().catch(err => {})
                message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
                return ramalcim.addPunitives(seçilenSebep.type, message.member, seçilenSebep.label, message, seçilenSebep.date)
        } else {
               return i.update({components: [], embeds: [ new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.no_munur)} İşlem sırasında hata oluştu lütfen bot sahibine başvurun.`)]})
           }
         }
        if (i.customId === `iptal`) {
            msg.delete().catch(err => {})
            return await i.update({ content: `${message.guild.emojiGöster(emojiler.no_munur)} ${ramalcim} isimli üyenin **${aktivite}** etkinliğinden cezalandırılma işlemi başarıyla iptal edildi.`, components: [], embeds: [] , ephemeral: true});
        }
    });
    collector.on("end", async i => {
        msg.delete().catch(err => {})
    })

    }
};

