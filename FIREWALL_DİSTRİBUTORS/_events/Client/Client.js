const CronJob = require('cron').CronJob
const GUILDS_SETTINGS = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
module.exports = async () => {
    let Aylık_systemcik = new CronJob('00 00 00 * * 1', async function() {
        let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
        let systemcik = Data.Ayarlar
        let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        if(!systemcik.aylikcartelim) return;
        if(systemcik.aylikcartelim && !systemcik.birAy) return await GUILD_SETTINGS.updateOne({guildID: message.guild.id}, {$set: {[`Ayarlar.aylikcartelim`]: false}}, {upsert: true}).catch(e => console.log(e));;
        if(systemcik.aylikcartelim && systemcik.birAy && !guild.roles.cache.has(systemcik.birAy)) return await GUILD_SETTINGS.updateOne({guildID: message.guild.id}, {$set: {[`Ayarlar.aylikcartelim`]: false}}, {upsert: true}).catch(e => console.log(e));
        guild.members.cache.filter(x => !x.user.bot && Date.now() - x.joinedAt > 1000 * 60 * 60 * 24 * 30 && !x.permissions.has("ADMINISTRATOR") && !x.roles.cache.has(roller.jailRolü) && !x.roles.cache.has(roller.şüpheliRolü)  && !x.roles.cache.has(roller.yasaklıTagRolü) && !roller.kayıtsızRolleri.some(rol => x.roles.cache.has(rol))).forEach(async (cartelim) => {
            if(Date.now() - cartelim.joinedAt > 1000 * 60 * 60 * 24 * 30) {
                if(!cartelim.roles.cache.has(systemcik.birAy)) await cartelim.roles.add(systemcik.birAy)
            }
            if(Date.now() - cartelim.joinedAt > 1000 * 60 * 60 * 24 * 90) {
                if(cartelim.roles.cache.has(systemcik.birAy)) await cartelim.roles.remove(systemcik.birAy)
                if(!cartelim.roles.cache.has(roller.ucAy)) await cartelim.roles.add(systemcik.ucAy)
            }
            if(Date.now() - cartelim.joinedAt > 1000 * 60 * 60 * 24 * 180) {
                if(cartelim.roles.cache.has(systemcik.ucAy)) await cartelim.roles.remove(systemcik.ucAy)
                if(!cartelim.roles.cache.has(systemcik.altiAy)) await cartelim.roles.add(systemcik.altiAy)
            }
            if(Date.now() - cartelim.joinedAt > 1000 * 60 * 60 * 24 * 270) {
                if(cartelim.roles.cache.has(systemcik.altiAy)) await cartelim.roles.remove(systemcik.altiAy)
                if(!cartelim.roles.cache.has(systemcik.dokuzAy)) await cartelim.roles.add(systemcik.dokuzAy)
            }
            if(Date.now() - cartelim.joinedAt > 1000 * 60 * 60 * 24 * 365) {
                if(cartelim.roles.cache.has(systemcik.dokuzAy)) await cartelim.roles.remove(systemcik.dokuzAy)
                if(!cartelim.roles.cache.has(systemcik.birYil)) await cartelim.roles.add(systemcik.birYil)
            }
        })    
    }, null, true, 'Europe/Istanbul');

    Aylık_systemcik.start();
}
module.exports.config = {
    Event: "ready"
};