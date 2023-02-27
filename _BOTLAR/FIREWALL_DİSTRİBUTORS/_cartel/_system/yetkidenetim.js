
const { Client, Message } = Discord = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const util = require("util")
const Stats = require("../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Stats");
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Staffs');
const ms = require('ms')
const moment = require('moment')
module.exports = {
    Isim: "yetkidenetim",
    Komut: ["yetkidenetim"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
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
    if(!sistem._rooter.rooters.includes(message.member.id)) return;
    return;
    let data = await Stats.find()
    let yetkiler = data.filter(m => {
        let cartelimToplam2 = 0;
        if(m.lifeTotalVoiceStats) cartelimToplam2 = Number(m.lifeTotalVoiceStats)
        let cartelim = message.guild.members.cache.get(m.userID)
        return cartelimToplam2 <= ms("12h") && message.guild.members.cache.has(m.userID) && m.userID != "966398944169033788" && !cartelim.permissions.has("ADMINISTRATOR") && !cartelim.permissions.has("MANAGE_ROLES") && roller.Yetkiler.some(x => cartelim.roles.cache.has(x))
    })
    let mesaj = ''
    let yetkiliListesi = yetkiler.forEach((m, index) => {
        let yetkiliCheck = new Promise(async function(yetkili, yetkilidegil) {
            let get = await Users.findOne({_id: m.userID})
            let staffget = await Upstaffs.findOne({_id: m.userID})
            let cartelim = message.guild.members.cache.get(m.userID)
            if(get && get.Staff) {
                if(staffget && staffget.Baslama && staffget.Baslama >= Date.now() - ms("10h")) {
                    yetkili("yeni yetkili")
                } else {
                    setTimeout(async() => {
                        cartelim.removeStaff(cartelim.roles.cache, true)
                        await Users.updateOne({ _id: cartelim.id }, { $push: { "StaffLogs": {
                          Date: Date.now(),
                          Process: "STATI GEÇERSİZ",
                          Role: cartelim.roles.hoist ? cartelim.roles.hoist.id : roller.başlangıçYetki,
                          Author: message.member.id
                        }}}, { upsert: true }) 
                        let altYetki = message.guild.roles.cache.get(roller.altilkyetki)
                        if(altYetki) await cartelim.roles.remove(cartelim.roles.cache.filter(rol => altYetki.position <= rol.position)).catch(err => {});
                    
                    }, 1050 * index)
                    yetkili(true)
                }
            } else  {
                yetkili(false)
           }
        });
        let cartelim = message.guild.members.cache.get(m.userID)
        if(yetkiliCheck) {
            yetkiliCheck.then(
                function(value) {{
                    mesaj += `<@${m.userID}> (${çevirSüre(m.lifeTotalVoiceStats)}) [**Yetkisi Çekildi**] (${value})\n`
                    message.channel.send(`<@${m.userID}> (${çevirSüre(m.lifeTotalVoiceStats)}) [**${value == "yeni yetkili" ? "Yeni Yetkili" : value ? "Yetkisi Çekildi" : "Yetkisi Çekilmedi"}**] (<t:${Number(String(Date.parse(cartelim.joinedAt)).substring(0, 10))}:R>)\n`)
                }},
              );
        } 
    })   
    let embed = new cartelinEmbedi()
    message.channel.send({embeds: [embed.setDescription(`${mesaj.length >= 1 ? mesaj : "İşleminiz biraz sonra başlayacak, lütfen bekleyin."}`)]}).catch(err => {
        const arr = Discord.Util.splitMessage(`${mesaj.length >= 1 ? mesaj : "Tebrikler! 12 Saat Altı Bir Yetkili Bulunamadı!"}`, { maxLength: 1950 });
        arr.forEach(element => {
            message.channel.send({embeds: [embed.setDescription(`${element}`)]});
        }); 
    })

  }
};

function çevirSüre(date) {
    return moment.duration(date).format('H [saat,] m [dakika]');
}