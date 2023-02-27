const { GuildMember, MessageEmbed, Message, Utils, MessageActionRow, MessageButton } = require("discord.js");
const fs = require('fs');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Roles = require('../../../../_SYSTEM/Databases/Schemas/Guards/GuildMember.Roles.Backup');

 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */

module.exports = async (oldPresence, newPresence) => {
    if(!newPresence) return;
    if(!newPresence.member) return;
    let embed = new cartelinEmbedi()
    let cartelim = newPresence.guild.members.cache.get(newPresence.member.user.id)
    if(!cartelim) return;
    if(cartelim.guild.id != global.sistem.SUNUCU.GUILD) return;
    const Guard = require('../../../../_SYSTEM/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: cartelim.guild.id})
    if(Data && !Data.offlineGuard) return;
    let Row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId('ver')
        .setEmoji(newPresence.guild.emojiGöster(emojiler.onay_munur))
        .setLabel('Rolleri Geri Ver!')
        .setStyle("SECONDARY"),
        )
        const Permissions = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD",  "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];        
        let arr = []
    let Dedection =  Object.keys(newPresence.member.presence.clientStatus);
    let CheckWeb = Dedection.find(x => x == "web");
    let memberSafeRoles =  cartelim.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)));
    if(memberSafeRoles) memberSafeRoles.forEach(rol => {
            arr.push(rol.id)
    })
    
    if(cartelim && cartelim.presence && cartelim.presence.status == "offline" && Permissions.some(x => cartelim.permissions.has(x))) {
        if(await client.checkMember(cartelim.id)) return; 
        await Roles.updateOne({_id: cartelim.id}, {$set: {"Roles": arr, Reason: "Çevrimdışı"}}, {upsert: true})
        if(arr && arr.length >= 1) await cartelim.roles.remove(arr, `Çevrimdışı alındığından dolayı yetkisi çekildi.`).catch(err => {})
        embed.setFooter("aktif olduğunda yetkisi tekrardan verilecektir.").setTitle("Sunucuda Bir Yönetici Çevrim-Dışı Aldı!").setDescription(`${cartelim} (\`${cartelim.id}\`) isimli yönetici Çevrim-Dışı oldu özel mesajları kapalı olduğundan dolayı bu kanala bilgilendirme atıldı.\n\`\`\`fix
Üzerinden Alınan Roller \`\`\`\
${arr.length >= 1 ? ` Çekilen Roller: ${arr.filter(x => cartelim.guild.roles.cache.get(x)).map(x => cartelim.guild.roles.cache.get(x)).join(", ")}` : ` Üzerinden herhangi bir rol alınmadı.` } `)
            let loged = newPresence.guild.kanalBul("guard-log");
            if(loged) await loged.send({embeds: [embed]})
    } else if(cartelim && cartelim.presence && cartelim.presence.status != "offline") {
        let Data = await Roles.findOne({_id: cartelim.id, Reason: "Çevrimdışı"})
        if(Data && Data.Roles && Data.Roles.length) {
            if(Data.Roles) cartelim.roles.add(Data.Roles, `Aktif olduğundan dolayı çekilen yetkileri tekrardan verildi.`).catch(err => {})
            await Roles.findByIdAndDelete(cartelim.id)
        }
    }
}

module.exports.config = {
    Event: "presenceUpdate"
}

client.on("presenceUpdate", async (oldPresence, newPresence) => {
    if(!newPresence) return;
    if(!newPresence.member) return;
    let embed = new cartelinEmbedi()
    let Dedection =  Object.keys(newPresence.member.presence.clientStatus);
    let cartelim = newPresence.guild.members.cache.get(newPresence.member.user.id)
    if(!cartelim) return;
    if(cartelim.guild.id != global.sistem.SUNUCU.GUILD) return;
    const Guard = require('../../../../_SYSTEM/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: cartelim.guild.id})
    if(Data && !Data.webGuard) return;
    let Row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId('ver')
        .setEmoji(newPresence.guild.emojiGöster(emojiler.onay_munur))
        .setLabel('Rolleri Geri Ver!')
        .setStyle("SECONDARY"),
    )
    const Permissions = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD",  "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];        
    let arr = []
    let CheckWeb = Dedection.find(x => x == "web");
    let memberSafeRoles =  cartelim.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)));
    if(memberSafeRoles) memberSafeRoles.forEach(rol => {
            arr.push(rol.id)
    })

    if(CheckWeb && Permissions.some(x => cartelim.permissions.has(x))) {
        if(await client.checkMember(cartelim.id)) return; 
         await Roles.updateOne({_id: cartelim.id}, {$set: {"Roles": arr, Reason: "Web tarayıcı girişi için kaldırıldı."}}, {upsert: true})
         if(arr && arr.length >= 1) await cartelim.roles.remove(arr, `Web üzerinden sunucuyu görüntülediği için.`).catch(err => {})
         embed.setFooter("aşağıda ki düğmeyi sadece sunucu sahibi kullanabilir.").setTitle("Bir Yönetici Sunucuya Webden Giriş Sağladı!").setDescription(`${cartelim} (\`${cartelim.id}\`) isimli yönetici Web tarayıcısından **Sunucu** ekranına giriş yaptığı için yetkisi çekildi.\n\`\`\`fix
 Üzerinden Alınan Roller \`\`\`\
 ${arr.length >= 1 ? ` Çekilen Roller: ${arr.filter(x => cartelim.guild.roles.cache.get(x)).map(x => cartelim.guild.roles.cache.get(x).name).join(", ")}` : ` Üzerinden herhangi bir rol alınmadı.` } `)
         let loged = newPresence.guild.kanalBul("guard-log");
         if(loged) await loged.send({embeds: [embed], components: [Row]}).then(async (msg) => {
             const tacsahip = await newPresence.guild.fetchOwner();
             const filter = i =>  i.customId == "ver" && (sistem._rooter.rooters.includes(i.user.id) || i.user.id === tacsahip.id)
             const collector = msg.createMessageComponentCollector({ filter, max: 1 })
          
             collector.on('collect', async i => { 
                 if(i.customId == "ver") {
                     let Data = await Roles.findOne({_id: cartelim.id})
                     if(Data && Data.Roles && Data.Roles.length) {
                         i.reply({content: `${cartelim.guild.emojiGöster(emojiler.onay_munur)} ${cartelim}, üyesinin çekilen rolleri başarıyla geri verildi.`, ephemeral: true})
                         if(Data.Roles) cartelim.roles.add(Data.Roles, `${i.user.tag} tarafından tekrardan verildi.`).catch(err => {})
                         await Roles.findByIdAndDelete(cartelim.id)
                     } else {
                         i.reply({content: `${cartelim.guild.emojiGöster(emojiler.no_munur)} ${cartelim}, üyesinin rolleri veritabanında bulunamadığından işlem sonlandırıldı.`, ephemeral: true})
                     }
                 }
             })
             collector.on('end', c => {
                 msg.edit({embeds: [embed], components: []}).catch(err => {})
             })
         });
         const owner = await newPresence.guild.fetchOwner();
         if(owner) owner.send({embeds: [embed]}).catch(err => {})
         client.processGuard({
            type: "Tarayıcı Girişi!",
            target: cartelim.id,
        })
 
     } else {
         return;
     }
})

