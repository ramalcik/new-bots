const {guildBackup} = require('../../../../_SYSTEM/Reference/Guild.Backup');
module.exports = async () => {
    setInterval(async () => {
        await guildBackup.guildRoles()
        await guildBackup.guildChannels()
    }, 1000*60*60*1);
}

module.exports.config = {
    Event: "ready"
}