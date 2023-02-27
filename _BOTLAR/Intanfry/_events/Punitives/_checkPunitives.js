const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const Settings = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
const { cartelinEmbedi } = require('../../../../_SYSTEM/Reference/Embed');

const forceBans = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Forcebans');
const Mutes = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Mutes');
const voiceMutes = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Vmutes');
const Jails = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Jails');
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const {VK, DC, STREAM, ETKINLIK} = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Activitys');

/**
* @param {Client} client 
*/

 module.exports = async () => {
    let _findServer = await Settings.findOne({ guildID: sistem.SUNUCU.GUILD })
    ayarlar = global.ayarlar = _findServer.Ayarlar
    roller = global.roller = _findServer.Ayarlar
    kanallar = global.kanallar = _findServer.Ayarlar
    
    setInterval(async () => {
        let köpekoçlar = await Jails.find({})
        let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        köpekoçlar.forEach(async (ceza) => {
            _findServer = await Settings.findOne({ guildID: sistem.SUNUCU.GUILD })
            ayarlar = global.ayarlar = _findServer.Ayarlar
            roller = global.roller = _findServer.Ayarlar
            kanallar = global.kanallar = _findServer.Ayarlar
            let ramalcim = guild.members.cache.get(ceza._id)
            if(!ramalcim && ceza.Duration && Date.now() >= ceza.Duration) {
                await Jails.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (ramalcim && ceza.Duration && Date.now() >= ceza.Duration) { 
                await Jails.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
                let User = await Users.findOne({ _id: ceza._id })
                if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
                    ramalcim.setNickname(`${ayarlar.type ? ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ""}${User.Name}`)
                    if(User.Gender == "Erkek") ramalcim.setRoles(roller.erkekRolleri)
                    if(User.Gender == "Kadın") ramalcim.setRoles(roller.kadınRolleri)
                    if(User.Gender == "Kayıtsız") ramalcim.setRoles(roller.kayıtsızRolleri)
                    if(ramalcim.user.username.includes(ayarlar.tag)) ramalcim.roles.add(roller.tagRolü).catch(err => {}) 
                } else {
                  if(roller.kayıtsızRolleri)  ramalcim.setRoles(roller.kayıtsızRolleri).catch(err => {}) 
                  if(ramalcim && ramalcim.manageable && ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
                  if(ramalcim && ramalcim.manageable && !ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`İsim | Yaş`)
                  if(ramalcim && ramalcim.manageable && !ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`Kayıtsız`)
                  if(ramalcim && ramalcim.manageable && ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
                }   
            } else {
               if(ramalcim && !ramalcim.roles.cache.get(roller.jailRolü)) await ramalcim.setRoles(roller.jailRolü)
            }
        })
    }, 3000)

    setInterval(async () => {
        let OrospucocuklarıKüfürEtti = await Mutes.find({})
        let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        OrospucocuklarıKüfürEtti.forEach(async (ceza) => {
            let ramalcim = guild.members.cache.get(ceza._id)
            if(!ramalcim && ceza.Duration && Date.now() >= ceza.Duration) {
                await Mutes.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (ramalcim && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.muteRolü)  await ramalcim.roles.remove(roller.muteRolü).catch(err => {})
                await Mutes.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(ramalcim && !ramalcim.roles.cache.get(roller.muteRolü)) await ramalcim.roles.add(roller.muteRolü).catch(err => {})
            }
        })
    }, 5000)

    setInterval(async () => {
        let Sesmute = await voiceMutes.find({})
        let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        Sesmute.forEach(async (ceza) => {
            let ramalcim = guild.members.cache.get(ceza._id)
            if(!ramalcim && ceza.Duration && Date.now() >= ceza.Duration) {
                await voiceMutes.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (ramalcim && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(ramalcim && ramalcim.voice.channel) await ramalcim.voice.setMute(false).catch(err => {})
                await voiceMutes.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                
                if(ramalcim && ramalcim.voice.channel) {
                    if(ayarlar && ayarlar.sorunCozmeKategorisi && ramalcim.voice.channel.parentId == ayarlar.sorunCozmeKategorisi) return;
                    await ramalcim.voice.setMute(true).catch(err => {})
                } 
            }
        })
    }, 7500);

    setInterval(async () => {
        let VKDATA = await VK.find({})
        let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        VKDATA.forEach(async (ceza) => {
            let ramalcim = guild.members.cache.get(ceza._id)
            if(!ramalcim && ceza.Duration && Date.now() >= ceza.Duration) {
                await VK.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (ramalcim && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.vkCezalıRolü) await ramalcim.roles.remove(roller.vkCezalıRolü).catch(err => {})
                await VK.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(ramalcim && !ramalcim.roles.cache.get(roller.vkCezalıRolü)) await ramalcim.roles.add(roller.vkCezalıRolü).catch(err => {})
            }
        })
    }, 30000);

    setInterval(async () => {
        let STREAMDATA = await STREAM.find({})
        let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        STREAMDATA.forEach(async (ceza) => {
            let ramalcim = guild.members.cache.get(ceza._id)
            if(!ramalcim && ceza.Duration && Date.now() >= ceza.Duration) {
                await STREAM.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (ramalcim && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.streamerCezalıRolü) await ramalcim.roles.remove(roller.streamerCezalıRolü).catch(err => {})
                await STREAM.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(ramalcim && !ramalcim.roles.cache.get(roller.streamerCezalıRolü)) await ramalcim.roles.add(roller.streamerCezalıRolü).catch(err => {})
            }
        })
    }, 25000);

    setInterval(async () => {
        let DCDATA = await DC.find({})
        let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        DCDATA.forEach(async (ceza) => {
            let ramalcim = guild.members.cache.get(ceza._id)
            if(!ramalcim && ceza.Duration && Date.now() >= ceza.Duration) {
                await DC.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (ramalcim && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.dcCezalıRolü) await ramalcim.roles.remove(roller.dcCezalıRolü).catch(err => {})
                await DC.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(ramalcim && !ramalcim.roles.cache.get(roller.dcCezalıRolü)) await ramalcim.roles.add(roller.dcCezalıRolü).catch(err => {})
            }
        })
    }, 45000);

    setInterval(async () => {
        let ETKINLIKDATA = await ETKINLIK.find({})
        let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        ETKINLIKDATA.forEach(async (ceza) => {
            let ramalcim = guild.members.cache.get(ceza._id)
            if(!ramalcim && ceza.Duration && Date.now() >= ceza.Duration) {
                await ETKINLIK.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (ramalcim && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.etkinlikCezalıRolü) await ramalcim.roles.remove(roller.etkinlikCezalıRolü).catch(err => {})
                await ETKINLIK.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(ramalcim && !ramalcim.roles.cache.get(roller.etkinlikCezalıRolü)) await ramalcim.roles.add(roller.etkinlikCezalıRolü).catch(err => {})
            }
        })
    }, 60000);
 }
 
 module.exports.config = {
     Event: "ready"
 };

