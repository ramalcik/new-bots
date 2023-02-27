const { GuildMember, MessageEmbed, Message, MessageActionRow, MessageButton } = require("discord.js");
const fs = require('fs');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Roles = require('../../../../_SYSTEM/Databases/Schemas/Guards/GuildMember.Roles.Backup');
 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */
  module.exports = async () => {

    

    setInterval(async () => {
        const Permissions = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD",  "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];  
        let newPresence = client.guilds.cache.get(sistem.SUNUCU.GUILD)
        if(!newPresence) return;
        const Guard = require('../../../../_SYSTEM/Databases/Schemas/Guards/Global.Guard.Settings');
        let Data = await Guard.findOne({guildID: newPresence.id})
        if(Data && !Data.webGuard) return; 
    newPresence.members.cache.filter(x => !x.user.bot && x.presence && x.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)))).forEach(async (ramalcim) => {
    
    let embed = new cartelinEmbedi()
    let Dedection =  Object.keys(ramalcim.presence.clientStatus);
    let Row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId('ver')
        .setEmoji(ramalcim.guild.emojiGöster(emojiler.onay_munur))
        .setLabel('Rolleri Geri Ver!')
        .setStyle("SECONDARY"),
    )
    
    const Permissions = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD",  "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];        
    
    let arr = []
    let CheckWeb = Dedection.find(x => x == "web");
    let memberSafeRoles = ramalcim.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)));
    if(memberSafeRoles) memberSafeRoles.forEach(rol => {
        arr.push(rol.id)
    })
    
    if(CheckWeb && Permissions.some(x => ramalcim.permissions.has(x))) {
       if(await client.checkMember(ramalcim.id)) return; 
        await Roles.updateOne({_id: ramalcim.id}, {$set: {"Roles": arr, Reason: "Web tarayıcı girişi için kaldırıldı."}}, {upsert: true})
        if(arr && arr.length >= 1) await ramalcim.roles.remove(arr, `Web üzerinden sunucuyu görüntülediği için.`).catch(err => {})
        .setTitle("Uyarı:Web Giriş").setDescription(`${ramalcim} (\`${ramalcim.id}\`) isimli kullanıcı Web tarayıcısından Discord  ekranına giriş yaptığından dolayı üzerinde bulunan yetkileri alındı..\n\`\`\`fix
Üzerinden Alınan Roller \`\`\`\
${arr.length >= 1 ? `Üzerinden Alınan Roller: ${arr.filter(x => ramalcim.guild.roles.cache.get(x)).map(x => ramalcim.guild.roles.cache.get(x).name).join(", ")}` : `Üzerinden herhangi bir rol alınmadı.` } `)
        let loged = ramalcim.guild.kanalBul("guard-log");
        if(loged) await loged.send({embeds: [embed], components: [Row]}).then(async (msg) => {
            const tacsahip = await ramalcim.guild.fetchOwner();
            const filter = i =>  i.customId == "ver" && (sistem._rooter.rooters.includes(i.user.id) || i.user.id === tacsahip.id)
            const collector = msg.createMessageComponentCollector({ filter, max: 1 })
         
            collector.on('collect', async i => { 
                if(i.customId == "ver") {
                    let Data = await Roles.findOne({_id: ramalcim.id})
                    if(Data && Data.Roles && Data.Roles.length) {
                        i.reply({content: `${ramalcim.guild.emojiGöster(emojiler.onay_munur)} ${ramalcim}, üyesinin alınan rolleri üzerine yeniden verildi.`, ephemeral: true})
                        if(Data.Roles) ramalcim.roles.add(Data.Roles, `${i.user.tag} tarafından tekrardan verildi.`).catch(err => {})
                        await Roles.findByIdAndDelete(ramalcim.id)
                    } else {
                        i.reply({content: `${ramalcim.guild.emojiGöster(emojiler.no_munur)} ${ramalcim}, üyesinin rolleri veritabanında bulunamadığından işlem başarısız.`, ephemeral: true})
                    }
                }
            })
            collector.on('end', c => {
                msg.edit({embeds: [embed], components: []}).catch(err => {})
            })
        });
        const owner = await ramalcim.guild.fetchOwner();
        if(owner) owner.send({embeds: [embed]}).catch(err => {})
    }
})
   
    }, 20000);
}

module.exports.config = {
    Event: "ready"
}