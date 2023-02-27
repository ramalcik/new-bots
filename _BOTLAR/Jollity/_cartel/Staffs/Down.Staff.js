const { MessageEmbed, MessageButton, MessageActionRow,  MessageSelectMenu } = require("discord.js");
const Stats = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Stats')
const Invites = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const Upstaff = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Staffs');

const moment = require('moment');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "düşür",
    Komut: ["düşür","dusur"],
    Kullanim: "düşür <@munur/ID>",
    Aciklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
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
    let embed = new cartelinEmbedi()
     if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR') && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x))) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0])
    if (!kullanıcı) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.guild.members.cache.get(kullanıcı.id);
    if (!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ramalcim.id == message.member.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kayıtsızRolleri.some(x => ramalcim.roles.cache.has(x))) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined);
      if(ayarlar.type && !ramalcim.user.username.includes(ayarlar.tag)) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
      if((ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(x => ramalcim.user.username.includes(x))) return message.reply({
        content: `Belirtilen üyenin üzerinde bir tag bulunmakta! Bu nedenden dolayı yetki işlemine devam edilemiyor. ${cevaplar.prefix}`
      }).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 7500);
      })
    let Upstaffs = await Upstaff.findOne({_id: ramalcim.id})
if(!Upstaffs ) {
    message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
} else {
    let yetkiBilgisi = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => ramalcim.roles.cache.has(x.rol)))]
    let rolBul =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkiBilgisi)-1];
    if(!rolBul) return message.reply({content: `${message.guild.emojiGöster(emojiler.no_munur)} ${ramalcim} isimli üye en alt yetkide daha fazla düşüremezsin.`, ephemeral: true})
    if(Upstaffs && !Upstaffs.StaffGiveAdmin) await Users.updateOne({_id: ramalcim.id}, {$set: {"StaffGiveAdmin": message.member.id}}, {upsert: true})
    if(roller.altYönetimRolleri.some(x => rolBul.exrol == x) || roller.yönetimRolleri.some(x => rolBul.exrol == x) || roller.üstYönetimRolleri.some(x => rolBul.exrol == x)) {
        await Upstaff.updateOne({_id: ramalcim.id}, { $set: {"Yönetim": true }}, {upsert: true})
    } else {
        await Upstaff.updateOne({_id: ramalcim.id}, { $set: {"Yönetim": false }}, {upsert: true})
    }
    let newRoles = []
    ramalcim.roles.cache.filter(x => yetkiBilgisi.rol != x.id && !yetkiBilgisi.exrol.includes(x.id)).map(x => newRoles.push(x.id))
    if(rolBul && rolBul.rol) {
      newRoles.push(rolBul.rol)
      if(rolBul.exrol && rolBul.exrol.length >= 1) newRoles.push(...rolBul.exrol)
    }
    ramalcim.roles.set(newRoles)
    await Upstaff.updateOne({_id: ramalcim.id}, { $set: {"Rolde": Date.now() }}, {upsert: true})
    await Users.updateOne({ _id: ramalcim.id }, { $push: { "StaffLogs": {
        Date: Date.now(),
        Process: "DÜŞÜRÜLME",
        Role: rolBul ? rolBul.rol : roller.başlangıçYetki,
        Author: message.member.id
    }}}, { upsert: true }) 
       await Upstaff.updateOne({_id: ramalcim.id}, {$set: {"Mission": {
        Tagged: 0,
        Register: 0,
        Invite: 0,
        Staff: 0,
        Sorumluluk: 0,
        CompletedSorumluluk: false,
        completedMission: 0,
        CompletedStaff: false,
        CompletedInvite: false,
        CompletedAllVoice: false,
        CompletedPublicVoice: false,
        CompletedTagged: false,
        CompletedRegister: false,
       }}}, {upsert: true});
       let logKanalı = message.guild.kanalBul("terfi-log")
       if(logKanalı) logKanalı.send({embeds: [embed.setDescription(`${message.member} yöneticisi, ${ramalcim} isimli üyeyi ${message.guild.roles.cache.get(rolBul.rol)} isimli rolüne düşürdü.`).setFooter(`bu işlem veritabanında kayıtlı kalır.`)]})
	 await Stats.updateOne({guildID: sistem.SUNUCU.GUILD, userID: ramalcim.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})      
await Upstaff.updateOne({ _id: ramalcim.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0, "Toplantı": 0, "Etkinlik": 0 }}, {upsert: true});
      message.reply({content: `${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne düşürüldü.`, ephemeral: true }).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
      })

    
}

    }
};

