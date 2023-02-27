const { Client, Collection, Constants, Intents, MessageActionRow, MessageButton, MessageEmbed, Options} = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const fs = require('fs')
const Query = require("./Distributors.Query");
const sistem = global.sistem = require('../GlobalSystem/server.json');
const GUILD_ROLE_DATAS = require("../Databases/Schemas/Guards/Backup/Guild.Roles")
const { GUILD } = require('../../_SYSTEM/Reference/Settings');
// SENKRON
const GUARD_SETTINGS = require('../../_SYSTEM/Databases/Schemas/Guards/Global.Guard.Settings');
const GUILD_SETTINGS = require('../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
// SENKRON

// GUARD LİMİT
const ms = require('ms');
const dataLimit = new Map()
// GUARD LİMİT
const request = require('request');
const { bgBlue, black, green } = require("chalk");
const DISCORD_LOGS = require('discord-logs')
const EventEmitter = require('events');

class munur extends Client {
      constructor (...options) {
            super({
                options,
                intents: [
                    32767,
                    "GUILDS",
                    "GUILD_MEMBERS",
                    "GUILD_PRESENCES"
                ],
                makeCache: Options.cacheWithLimits({
                    MessageManager: 2000,
                    PresenceManager: 50000,
                }),
            });
            DISCORD_LOGS(this)
            Object.defineProperty(this, "location", { value: process.cwd() });
            this.sistem = this.system = require('../GlobalSystem/server.json');
            GUILD.fetch(this.sistem.SUNUCU.GUILD)
            this.users.getUser = GetUser;
            this.getUser = GetUser;
            async function GetUser(id) { try { return await this.users.fetch(id); } catch (error) { return undefined; } };
            this.logger = require('../Global.Functions/Logger');
            this.cartelinEmbedi = global.cartelinEmbedi = require('../Reference/Embed');
            require('../Global.Functions/Dates');
            require('../Global.Functions/Numbers');
            require('../Bases/_sources');
            this.Upstaffs = {}
            this._statSystem = global._statSystem = {}
            require('../Bases/_user');
            this.botİsmi;
            this.commands = new Collection();
            this.aliases = new Collection();
            this.setMaxListeners(10000);
            this.Distributors = global.Distributors = [];
            this.eventEmitter = new EventEmitter();
            this.Economy = require('../Additions/Economy/_index');
	     

            this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
                .on("disconnect", () => this.logger.log("Bot is disconnecting...", "disconnecting"))
                .on("reconnecting", () => this.logger.log("Bot reconnecting...", "reconnecting"))
                .on("error", (e) => this.logger.log(e, "error"))
                .on("warn", (info) => this.logger.log(info, "warn"));

              //  process.on("unhandledRejection", (err) => { this.logger.log(err, "caution") });
                process.on("warning", (warn) => { this.logger.log(warn, "varn") });
                process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
                process.on("uncaughtException", err => {
                    const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                        console.error("Beklenmedik Hata: ", hata);
                       // process.exit(1);
                });
            
        }

        async fetchCommands(active = true) {
            if(!active) return;
            let dirs = fs.readdirSync("./_cartel", { encoding: "utf8" });
            this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
            dirs.forEach(dir => {
                let files = fs.readdirSync(`../../_BOTLAR/${this.botİsmi}/_cartel/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
                this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} ${files.length} commands loaded in ${dir} category.`, "load");
                files.forEach(file => {
                    let referans = require(`../../_BOTLAR/${this.botİsmi}/_cartel/${dir}/${file}`);
                    if(referans.onLoad != undefined && typeof referans.onLoad == "function") referans.onLoad(this);
                    this.commands.set(referans.Isim, referans);
                    if (referans.Komut) referans.Komut.forEach(alias => this.aliases.set(alias, referans));
                });
            });
        }
    
        async fetchEvents(active = true) {
            if(!active) return;
            let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
            dirs.forEach(dir => {
                let files = fs.readdirSync(`../../_BOTLAR/${this.botİsmi}/_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
                files.forEach(file => {
                    let referans = require(`../../_BOTLAR/${this.botİsmi}/_events/${dir}/${file}`);
                    this.on(referans.config.Event, referans);
                });
            });
        }
        
       async startDistributors() {
                    let Data = await GUARD_SETTINGS.findOne({guildID: global.sistem.SUNUCU.GUILD})
                    if(Data && Data.urlSpam && Data.spamURL && (Data.selfTokens && Data.selfTokens.length > 0)) {
                        let guild = this.guilds.cache.get(global.sistem.SUNUCU.GUILD)
                        setInterval(async () => {
                            Data = await GUARD_SETTINGS.findOne({guildID: guild.id})
                            if(Data && !Data.urlSpam && (Data.selfTokens && Data.selfTokens.length < 0)) return;
                            if(!guild) return 
                            if (guild.vanityURLCode && (guild.vanityURLCode == Data.spamURL)) return;
                            let log = this.channels.cache.find(x => x.name.includes("guard") || x.name == "guard-log")
                            if(log) log.send({content: `@everyone`,embeds: [
                                new MessageEmbed()
                                    .setColor("RANDOM")
                                    .setAuthor({name: guild.name, iconURL: guild.iconURL({dynmaic: true})})
                                    .setDescription(`**${guild.name}** sunucusunun **Özel URL** değiştiğinden dolayı güvenlik amacıyla sistem üzerinde belirlenen "${Data.spamURL}" urlsi otomatik olarak tekrar güncellendi.`)
                                    .setFooter({text: `Synl.io > Genel Bot Ayarları > Güvenlik Ayarları > URL Tekrarlayıcı | Tarafından Bu Ayarları Kontrol Edebilirsiniz.`, iconURL: "https://cdn.discordapp.com/attachments/1034818711921643560/1049216437727801414/favicon.png"})
                            ]})
                            Data.selfTokens.map(self_token => {
                                request({method: "PATCH", url: `https://discord.com/api/v9/guilds/${guild.id}/vanity-url`,
                                headers: { 
                                    "Authorization": `${self_token}`,
                                    "User-Agent": `Discordbot munur`,
                                    "Content-Type": `application/json`,
                                    "X-Audit-Log-Reason": `URL Tekrarlayici`
                                },
                                body: { "code": Data.spamURL },
                                json: true
                            });
                            
                            })
                        }, 1000);
                    } 
            sistem.TOKENLER.FIREWALL.DISTS.forEach(async (token) => {
                let botClient = new Client({
                    intents: [
                        32767,
                        "GUILDS",
                        "GUILD_MEMBERS",
                        "GUILD_PRESENCES"
                    ],
                    presence: {name: sistem.botStatus.Name, status: sistem.botStatus.Status, type: sistem.botStatus.type,url: sistem.botStatus.Url}
                
                  });
                  botClient.on("ready", async () => {
                    let guild = botClient.guilds.cache.get(global.sistem.SUNUCU.GUILD);
                    if(!guild) {
                        console.log(`https://discord.com/api/oauth2/authorize?client_id=${botClient.user.id}&permissions=0&scope=bot%20applications.commands`)
                        return 
                    }
                    this.logger.log(`${botClient.user.tag} isimli dağıtıcı başarıyla aktif oldu.`, "dist")
                    Distributors.push(botClient)
                    botClient.queryTasks = new Query();
                    botClient.queryTasks.init(1000);
                  })
                  await botClient.login(token).catch(err => {
                    this.logger.log(`${black.bgHex('#D9A384')("Dağıtıcı Token Arızası" + ` : ${token}`)}`,"error")
                  })
            })
        }

        closeDistributors() { 
            if(this.Distributors && this.Distributors.length) {
                if(this.Distributors.length >= 1) {
                    this.Distributors.forEach(x => {
                        x.destroy()
                    })
                }
            }
        }

        async checkMember(id, type, process = "İşlem Bulunamadı.") {
            let guild = this.guilds.cache.get(sistem.SUNUCU.GUILD)
            if(!guild) return false;
            let ramalcim = guild.members.cache.get(id)
            if(!ramalcim) return;
            let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
            let Sunucu = await GUILD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
            if(!Sunucu) return false;
            if(!Whitelist) return false;
            let guildSettings = Sunucu.Ayarlar
            if(!guildSettings) return false;
            if(!Whitelist.guildProtection) return true;
            if(ramalcim.id === this.user.id || ramalcim.id === ramalcim.guild.ownerId || Whitelist.unManageable.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g)) || Whitelist.BOTS.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))|| guildSettings.staff.includes(ramalcim.id)) return true; 
            if(!type) return false;
            switch (type) {
                case "guild": {
                    if(Whitelist.fullAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))  || Whitelist.guildAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))) return this.checkProcessLimit(ramalcim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "emoji": {
                    if(Whitelist.fullAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))  || Whitelist.emojiAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))) return this.checkProcessLimit(ramalcim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "bot": {
                    if(Whitelist.fullAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))  || Whitelist.botAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))) return this.checkProcessLimit(ramalcim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "member": {
                    if(Whitelist.fullAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))  || Whitelist.memberAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))) return this.checkProcessLimit(ramalcim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "channels": {
                    if(Whitelist.fullAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))  || Whitelist.channelsAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))) return this.checkProcessLimit(ramalcim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "roles": {
                    if(Whitelist.fullAccess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))  || Whitelist.rolesAcess.some(g => ramalcim.id === g || ramalcim.roles.cache.has(g))) return this.checkProcessLimit(ramalcim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
            }
            return false;
        }


        async checkProcessLimit(ramalcim, limit, zaman, process) {
            let id = ramalcim.id
            let limitController = dataLimit.get(id) || []
            let type = { _id: id, proc: process, date: Date.now() }
            let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
            if(!Whitelist.limit) return true;
            limitController.push(type)
            dataLimit.set(id, limitController)
            setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms(zaman))
            if (limitController.length >= limit) { 
                let loged = ramalcim.guild.kanalBul("guard-log");
                let taslak = `${ramalcim} (\`${ramalcim.id}\`) isimli güvenli listesinde ki yönetici işlem sınırını aştığı için "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Yapılan işlemleri;
${limitController.sort((a, b) => b.date - a.date).map((x, index) => `${index+1}. | ${x.proc} | ${tarihsel(x.date)}`).join("\n")}
                \`\`\``
                if(loged) loged.send(taslak);
                let Sunucu = await GUILD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
                let guildSettings = Sunucu.Ayarlar
                if(Sunucu && guildSettings) {
                    guildSettings.staff.forEach(x => {
                        let botOwner = ramalcim.guild.members.cache.get(x)
                        if(botOwner) botOwner.send(taslak).catch(err => {})
                    })
                }
                let taç = ramalcim.guild.members.cache.get(ramalcim.guild.ownerId)
                if(taç) taç.send(taslak).catch(err => {})
                return false 
            } else {
                return true
            }
        }    

        async queryManage(oldData, newData) {
            const guildSettings = require('../Databases/Schemas/Global.Guild.Settings');
            let veriData = await guildSettings.findOne({ guildID: sistem.SUNUCU.GUILD })
            let sunucuData = veriData.Ayarlar
            if(sunucuData) {              
                if(oldData === sunucuData.tagRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.tagRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.muteRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.muteRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.jailRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.jailRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.şüpheliRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.şüpheliRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.yasaklıTagRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.yasaklıTagRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.vipRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.vipRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.Katıldı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.Katıldı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.altilkyetki) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.altilkyetki": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.etkinlikKatılımcısı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.etkinlikKatılımcısı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.cekilisKatılımcısı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.cekilisKatılımcısı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.TerfiLog) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.TerfiLog": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.kurallarKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.kurallarKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.hoşgeldinKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.hoşgeldinKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.chatKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.chatKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.toplantıKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.toplantıKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.davetKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.davetKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.publicKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.publicKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.registerKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.registerKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.streamerKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.streamerKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.photoChatKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.photoChatKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.sleepRoom) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.sleepRoom": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.başlangıçYetki) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.başlangıçYetki": newData}}, {upsert: true})
                }
                if(sunucuData.erkekRolleri && sunucuData.erkekRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.erkekRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.erkekRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kadınRolleri && sunucuData.kadınRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.kadınRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.kadınRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kayıtsızRolleri && sunucuData.kayıtsızRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.kayıtsızRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.kayıtsızRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.Yetkiler && sunucuData.Yetkiler.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.Yetkiler": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.Yetkiler": newData}}, {upsert: true})
                }
                if(sunucuData.teyitciRolleri && sunucuData.teyitciRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.teyitciRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.teyitciRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kurucuRolleri && sunucuData.kurucuRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.kurucuRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.kurucuRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.ayrıkKanallar && sunucuData.ayrıkKanallar.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.ayrıkKanallar": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.ayrıkKanallar": newData}}, {upsert: true})
                }
                if(sunucuData.izinliKanallar && sunucuData.izinliKanallar.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.izinliKanallar": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.izinliKanallar": newData}}, {upsert: true})
                }
                if(sunucuData.rolPanelRolleri && sunucuData.rolPanelRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.rolPanelRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.rolPanelRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.üstYönetimRolleri && sunucuData.üstYönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.üstYönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.üstYönetimRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.altYönetimRolleri && sunucuData.altYönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.altYönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.altYönetimRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.yönetimRolleri && sunucuData.yönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.yönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.yönetimRolleri": newData}}, {upsert: true})
                }

                if(sunucuData.banHammer && sunucuData.banHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.banHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.banHammer": newData}}, {upsert: true})
                }
                if(sunucuData.jailHammer && sunucuData.jailHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.jailHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.jailHammer": newData}}, {upsert: true})
                }
                if(sunucuData.voiceMuteHammer && sunucuData.voiceMuteHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.voiceMuteHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.voiceMuteHammer": newData}}, {upsert: true})
                }
                if(sunucuData.muteHammer && sunucuData.muteHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.muteHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.muteHammer": newData}}, {upsert: true})
                }
                if(sunucuData.warnHammer && sunucuData.warnHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.warnHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.warnHammer": newData}}, {upsert: true})
                }
                if(sunucuData.coinChat && sunucuData.coinChat.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.coinChat": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.coinChat": newData}}, {upsert: true})
                }

                
            }
        }
        rolVer(sunucu, role) {
            let length = (sunucu.members.cache.filter(member => member && !member.roles.cache.has(role.id) && !member.user.bot).array().length + 5);

            const sayı = Math.floor(length / Distributors.length);
           if(sayı < 1) sayı = 1
  
            let Dists = Distributors.length;
            let countUser = length % Dists;
            let ramalcimlercik = []
            sunucu.members.cache.filter(member => member && !member.roles.cache.has(role.id) && !member.user.bot).map(x => {
                ramalcimlercik.push(x.id)
            })
            Distributors.forEach((guard, _index) => {
              const members = ramalcimlercik.splice(0, (_index == 0 ? sayı + countUser : sayı));
              if (members.length <= 0) return client.logger.log(`[${role}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`, "log");
              guard.queryTasks.query(async () => {
                  return new Promise(async (resolve) => { 
                      for (let index = 0; index < members.length; index++) {
                          if(!role) {
                              client.logger.log(`[${role}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`, "log");
                              break;
                          }
                          let ramalcimid = members[index];
                          let ramalcim = guard.guilds.cache.get(global.sistem.SUNUCU.GUILD).members.cache.get(ramalcimid)
                          if (!ramalcim || (ramalcim && ramalcim.roles.cache.has(role.id))) continue;
                          await ramalcim.roles.add(role.id).catch(() => {
                              client.logger.log(`${ramalcim.user.tag} - Üyesine rol verilemedi.`, "log");
                          })
                      }
                      resolve();
                  })
                })
                function sleep(ms) {
                  return new Promise(resolve => setTimeout(resolve, ms));
                }
              })
          }
  
          rolKur(role, newRole) {
            GUILD_ROLE_DATAS.findOne({ roleID: role }, async (err, data) => {
              let length = data.members.length
              const sayı = Math.floor(length / Distributors.length);
             if(sayı < 1) {
                const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(sistem.SUNUCU.GUILD).channels.cache.get(e.id))
                for await (const perm of channelPerm) {
                  const bott = Distributors[0]
                  const guild2 = bott.guilds.cache.get(sistem.SUNUCU.GUILD)
                  let kanal = guild2.channels.cache.get(perm.id);
                  let newPerm = {};
                  perm.allow.forEach(p => {
                    newPerm[p] = true;
                  });
                  perm.deny.forEach(p => {
                    newPerm[p] = false;
                  });
                  kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client.logger.error(error));
                }
                return
             }
              const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(sistem.SUNUCU.GUILD).channels.cache.get(e.id))
              for await (const perm of channelPerm) {
                const bott = Distributors[0]
                const guild2 = bott.guilds.cache.get(sistem.SUNUCU.GUILD)
                let kanal = guild2.channels.cache.get(perm.id);
                let newPerm = {};
                perm.allow.forEach(p => {
                  newPerm[p] = true;
                });
                perm.deny.forEach(p => {
                  newPerm[p] = false;
                });
                kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client.logger.error(error));
              }
              
              let Dists = Distributors.length;
              let countUser = length % Dists;
              Distributors.forEach((guard, _index) => {
                const members = data.members.splice(0, (_index == 0 ? sayı + countUser : sayı));
                if (members.length <= 0) return client.logger.log(`[${role}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`, "log");
                guard.queryTasks.query(async () => {
                    return new Promise(async (resolve) => { 
                        for (let index = 0; index < members.length; index++) {
                            if(!newRole) {
                                client.logger.log(`[${role}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`, "log");
                                break;
                            }
                            let ramalcimid = members[index];
                            let ramalcim = guard.guilds.cache.get(global.sistem.SUNUCU.GUILD).members.cache.get(ramalcimid)
                            if (!ramalcim || (ramalcim && ramalcim.roles.cache.has(newRole.id))) continue;
                            await ramalcim.roles.add(newRole.id).catch(() => {
                                client.logger.log(`${ramalcim.user.tag} - Üyesine rol verilemedi.`, "log");
                            })
                        }
                        resolve();
                    })
                  })
                  function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                  }
                })


                const newData = new GUILD_ROLE_DATAS({
                    roleID: newRole.id,
                    name: newRole.name,
                    color: newRole.hexColor,
                    hoist: newRole.hoist,
                    position: newRole.position,
                    permissions: newRole.permissions.bitfield,
                    mentionable: newRole.mentionable,
                    time: Date.now(),
                    members: data.members.filter(e => newRole.guild.members.cache.get(e)),
                    channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
                  });
                  newData.save();
            })
          }
          
        async processGuard(opt) {
            await GUARD_SETTINGS.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {
                "Process": {
                    date: Date.now(),
                    type: opt.type,
                    target: opt.target,
                    member: opt.member ? opt.member : undefined,
                }
            }}, {upsert: true});
        }

        async punitivesAdd(id, type) {
            let ramalcim = client.guilds.cache.get(sistem.SUNUCU.GUILD).members.cache.get(id);
            if (!ramalcim) return;
            if (type == "jail") { 
            if(ramalcim.voice.channel) await ramalcim.voice.disconnect().catch(err => {})
            return await ramalcim.roles.cache.has(roller.boosterRolü) ? ramalcim.roles.set([roller.boosterRolü, roller.şüpheliRolü]) : ramalcim.roles.set([roller.şüpheliRolü]).catch(err => {}); 
            }
        
            if (type == "ban") return await ramalcim.ban({ reason: "Guard Tarafından Siki Tuttu." }).catch(err => {}) 
        };
        
        async allPermissionClose() {
            const Roles = require('../Databases/Schemas/Guards/Guild.Protection.Roles.Backup');
            let sunucu = client.guilds.cache.get(sistem.SUNUCU.GUILD);
            if(!sunucu) return;
            
            const perms = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];
            let roller = sunucu.roles.cache.filter(rol => rol.editable).filter(rol => perms.some(yetki => rol.permissions.has(yetki)))
            roller.forEach(async (rol) => {
                await Roles.updateOne({Role: rol.id}, {$set: {"guildID": sunucu.id, Reason: "Guard Tarafından Devre-Dışı Kaldı!", "Permissions": rol.permissions.bitfield }}, {upsert: true})
                await rol.setPermissions(0n)
            });

            if(roller) {
                let Rows = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("Rol İzinleri Aktif Et")
                        .setStyle("SECONDARY")
                        .setCustomId("proc_off")
                        .setEmoji("943285259733184592")

                )
                let kanal = sunucu.kanalBul("guard-log")
                const owner = await sunucu.fetchOwner();
                if(owner) owner.send({embeds: [new MessageEmbed().setColor("RANDOM").setDescription(`**Merhaba!** ${sunucu.name}
Aşağı da listelenmekte olan rol(lerin) önemli izinleri başarıyla kapatıldı. ${sunucu.emojiGöster(emojiler.onay_munur) ? sunucu.emojiGöster(emojiler.onay_munur) : ":white_check_mark:"}

**İzinleri Kapatılan Rol(ler)**
${roller.size >= 1 ? roller.map(x => `\` • \` ${x} (\`${x.id}\`)`).join("\n ") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}

Yukarda bulunan rol(lerin) izinlerini tekrardan aktif etmek için, ${sunucu.name} sunucusunda bulunan \`#guard-log\` kanalında ki düğmeden aktif edebilirsin.`)]}).catch(err => {})

                if(kanal) kanal.send({content:`@everyone`, embeds: [new MessageEmbed().setColor("RANDOM").setDescription(`**Merhaba!** ${sunucu.name}
Aşağı da listelenmekte olan rol(lerin) önemli izinleri başarıyla kapatıldı. ${sunucu.emojiGöster(emojiler.onay_munur) ? sunucu.emojiGöster(emojiler.onay_munur) : ":white_check_mark:"}

**İzinleri Kapatılan Rol(ler)**
${roller.size >= 1 ? roller.map(x => `\` • \` ${x} (\`${x.id}\`)`).join("\n ") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}

Aşağıda bulunan düğme ile tekrardan aktif edebilirsin. Bunun için sunucu sahibi veya bot sahibi olmalısın.`)], components: [Rows]}).then(async (msg) => {
                    let tacsahip = await sunucu.fetchOwner();
                    var filter = i =>  i.customId == "proc_off" && (sistem._rooter.rooters.includes(i.user.id) || i.user.id === tacsahip.id)
                    let collector = msg.createMessageComponentCollector({ filter, max: 1 })
                    collector.on('collect', async (i) => {
                        let checkRoles = await Roles.find({})
                        if(checkRoles) checkRoles.filter(x => msg.guild.roles.cache.get(x.Role)).forEach(async (data) => {
                            let rolgetir = msg.guild.roles.cache.get(data.Role)
                            if(rolgetir) rolgetir.setPermissions(data.Permissions).catch(err => {});
                        })
                        Rows.components[0].setStyle("SUCCESS").setLabel("Başarıyla Rol İzinleri Aktif Edildi").setDisabled(true)
                        msg.edit({components: [Rows]})
                        i.reply({embeds: [new MessageEmbed().setColor("RANDOM").setDescription(`
Başarıyla ${sunucu.name} sunucusunun **${checkRoles ? checkRoles.length >= 1 ? checkRoles.length : 0 : 0}** rolünün izinleri tekrardan aktif edildi. ${sunucu.emojiGöster(emojiler.onay_munur) ? sunucu.emojiGöster(emojiler.onay_munur) : ":white_check_mark:"}

${checkRoles.length >= 1 ? ` **İzinleri Tekrardan Açılan Rol(ler)**:\n`+ checkRoles.map(x => `\` • \` ${sunucu.roles.cache.get(x.Role)} (\`${x.Role}\`)`).join("\n") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}`)],

                        ephemeral: true})
                        await Roles.deleteMany({guildID: sunucu.id})
                    })
                })
            }
        }

        connect(token) {
            if(!token) {
                this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`,"error");
                process.exit()
                return;
            }
            this.login(token).then(munur => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} BOT kullanıma aktif edilmiştir.`,"botReady")
                this.user.setPresence({ activities: [{name:sistem.botStatus.Name}], status:sistem.botStatus.Status })
                this.on("ready", async () => { 
                    this.Upstaffs = require('../Additions/Staff/_index');
                    this._statSystem = global._statSystem = require('../../_SYSTEM/Additions/Staff/Sources/_settings');
                    await this.startDistributors()
                    let guild = client.guilds.cache.get(global.sistem.SERVER.ID);
                    if(!guild) {
                        console.log(`https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=0&scope=bot%20applications.commands`)
                        return
                    }
                    if(guild) await guild.members.fetch().then(fetchedMembers=> { })
                    let kanal = this.channels.cache.get(global.ayarlar ? global.ayarlar.botSesKanalı : "123")
                    if(kanal) joinVoiceChannel({ channelId: kanal.id, guildId: kanal.guild.id, adapterCreator: kanal.guild.voiceAdapterCreator });
              
                })
                this.on("ready", () => {
                    setInterval(async () => {
                        client.user.setPresence({
                            activities: [{ name: sistem.botStatus.Name, url: sistem.botStatus.Url, type: sistem.botStatus.type }],
                            status: sistem.botStatus.Status
                        });
                        const channel = client.channels.cache.get(sistem.SUNUCU.VoiceChannelID)
                        joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                            selfDeaf: true,
                            selfMute: true,
                        });
                    }, 60 * 1000);
                })

            }).catch(munur => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`,"reconnecting")
                setTimeout(() => {
                    this.login().catch(munur => {
                        this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`,"error")
                        process.exit()
                    })
                }, 5000 )
            })
        }
        
}

module.exports = { munur }