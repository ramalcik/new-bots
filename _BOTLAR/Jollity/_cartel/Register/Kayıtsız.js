const Kullanici = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require('../../../../_SYSTEM/Reference/Embed');
const getLimit = new Map();

module.exports = {
    Isim: "kayıtsız",
    Komut: ["unregistered","kayitsizyap","kayitsiz"],
    Kullanim: "kayıtsız <@munur/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi kayıtsız üye olarak belirler.",
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
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if (getLimit.get(message.author.id) >= ayarlar.kayıtsızLimit) return message.reply(cevaplar.bokyolu).then(s => setTimeout(() => s.delete().catch(err => {}), 7500));
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kayıtsızRolleri.some(x => ramalcim.roles.cache.has(x))) return message.reply(cevaplar.kayıtsız).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.reply(cevaplar.sebep).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ayarlar.isimyas) {
      if(ayarlar.type) {
        await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag  : (ayarlar.tagsiz ? ayarlar.tagsiz  : (ayarlar.tag || ""))} İsim | Yaş`)
      } else {
        await ramalcim.setNickname(`İsim | Yaş`)
      }
    } else {
      if(ayarlar.type) {
        await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag  : (ayarlar.tagsiz ? ayarlar.tagsiz  : (ayarlar.tag || ""))} Kayıtsız`)
      } else {
        await ramalcim.setNickname(`Kayıtsız`)
      }
    }
    ramalcim.setRoles(roller.kayıtsızRolleri)
    if(ramalcim.voice.channel) ramalcim.voice.disconnect()
    let data = await Kullanici.findOne({_id: ramalcim.id});
    if(data && data.Name) await Kullanici.updateOne({_id: ramalcim.id}, {$set: { "Gender": "Kayıtsız" }, $push: { "Names": { Staff: message.member.id, Date: Date.now(), Name: data.Name, State: "Kayıtsıza Atıldı" } } }, { upsert: true })
    ramalcim.Delete()
    ramalcim.removeStaff()
    let kayıtsızLog = message.guild.kanalBul("kayıtsız-log")
    if(kayıtsızLog) kayıtsızLog.send({embeds: [ new cartelinEmbedi().setDescription(`${ramalcim} isimli üye ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> **${sebep}** nedeniyle \`${message.guild.name}\` sunucusunda kayıtsız üye olarak belirlendi.`)]})
    message.reply({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} ${ramalcim} üyesi, **${sebep}** nedeniyle başarıyla kayıtsız'a gönderildi.`)]})
    ramalcim.send({embeds: [new cartelinEmbedi().setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile <t:${String(Date.now()).slice(0, 10)}:R> kayıtsız'a atıldın.`)]}).catch(x => {
      })
    if(Number(ayarlar.kayıtsızLimit) && ayarlar.kayıtsızLimit > 1) {
      if(!message.member.permissions.has('ADMINISTRATOR') && !sistem._rooter.rooters.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
        setTimeout(() => {
          getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
        },1000*60*5)
      }
    }
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
};