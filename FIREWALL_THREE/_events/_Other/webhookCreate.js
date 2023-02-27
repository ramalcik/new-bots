const { GuildMember, MessageEmbed, Message, Guild, GuildChannel } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

 /**
 * @param {GuildChannel} channel
 */


module.exports = async (channel) => {
    const Guard = require('../../../../_SYSTEM/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: channel.guild.id})
    if(Data && !Data.webhookGuard) return;
    let embed = new cartelinEmbedi().setTitle("Sunucuda Webhook Oluşturuldu!")
    let entry = await channel.guild.fetchAuditLogs({type: 'WEBHOOK_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, undefined ,"Webhook Oluşturma!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${channel.name}\` kanalında webhook oluşturuldu ve oluşturulduğu gibi silinip cezalandırıldı.`);
    const webhooks = await channel.fetchWebhooks();
        webhooks.forEach(async element => {
            await element.delete()
        });
        let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await channel.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Webhook Oluşturdu!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "webhookUpdate"
}
