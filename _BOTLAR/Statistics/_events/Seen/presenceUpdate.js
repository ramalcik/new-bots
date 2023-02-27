const { GuildMember, MessageEmbed, Message, MessageActionRow, MessageButton, UserFlags } = require("discord.js");
const fs = require('fs');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Stats = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Stats');
const Seens = require('../../../../_SYSTEM/Databases/Schemas/Guild.Users.Seens');

module.exports = async (oldPresence, newPresence) => {
    if(!newPresence) return;
    if(!newPresence.member) return;
    let ramalcim = newPresence.guild.members.cache.get(newPresence.member.user.id) 
    if(!ramalcim) return;
    if(ramalcim.guild.id != global.sistem.SUNUCU.GUILD) return;
    if(ramalcim && ramalcim.presence && ramalcim.presence.status == "offline") {
        await Seens.updateOne({userID: ramalcim.id}, {$set: {"lastOffline": Date.now(),
        "last": {
            type: "OFFLINE",
            date: Date.now(),
        }}}, {upsert: true})
    } else if(ramalcim && ramalcim.presence && ramalcim.presence.status != "offline") {
        await Seens.updateOne({userID: ramalcim.id}, {$set: {"lastOnline": Date.now(), "lastSeen": Date.now(), "last": {
            type: "ONLINE",
            date: Date.now(),
        }}}, {upsert: true})
    }
}

module.exports.config = {
    Event: "presenceUpdate"
}


client.on("userAvatarUpdate", async (user, oldAvatarURL, newAvatarURL) => {
    await Seens.updateOne({userID: user.id}, {$set: {
        "lastSeen": Date.now(),
        "lastAvatar": Date.now(),
        "last": {
            type: "AVATAR",
            date: Date.now(),
            new: newAvatarURL,
            old: oldAvatarURL,
        }
    }}, {upsert: true})

});

client.on("voiceChannelJoin", async (member, channel) => {
    await Seens.updateOne({userID: member.id}, {$set: {
        "lastSeen": Date.now(),
        "lastVoice": Date.now(),
        "last": {
            type: "VOICE",
            date: Date.now(),
            channel: channel.id,
        }
    }}, {upsert: true})
});

client.on("userUsernameUpdate", async (user, oldUsername, newUsername) => {
    await Seens.updateOne({userID: user.id}, {$set: {
        "lastSeen": Date.now(),
        "lastUsername": Date.now(),
        "last": {
            type: "USERNAME",
            date: Date.now(),
            new: newUsername,
            old: oldUsername,
        }
    }}, {upsert: true})
});

client.on("userDiscriminatorUpdate", async (user, oldUsername, newUsername) => {
    await Seens.updateOne({userID: user.id}, {$set: {
        "lastSeen": Date.now(),
        "lastDiscriminator": Date.now(),
        "last": {
            type: "DISCRIMİNATOR",
            date: Date.now(),
            new: newUsername,
            old: oldUsername,
        }
    }}, {upsert: true})
});