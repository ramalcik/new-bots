const { Client, Collection, Constants, Intents, MessageActionRow, MessageButton, MessageEmbed, Options} = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const fs = require('fs')

const sistem = global.sistem = require('../GlobalSystem/server.json');
const { GUILD } = require('../../_SYSTEM/Reference/Settings');

// SENKRON
const GUARD_SETTINGS = require('../../_SYSTEM/Databases/Schemas/Guards/Global.Guard.Settings');
const GUILD_SETTINGS = require('../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
// SENKRON

// GUARD LİMİT
const ms = require('ms');
const dataLimit = new Map()
// GUARD LİMİT
let TAC = []
const { bgBlue, black, green } = require("chalk");
const DISCORD_LOGS = require('discord-logs')
class munur extends Client {
      constructor (...options) {
            super({
                options,
                intents: [32767],

            });
            DISCORD_LOGS(this)
            Object.defineProperty(this, "location", { value: process.cwd() });
            this.sistem = this.system = require('../GlobalSystem/server.json');

            GUILD.fetch(this.sistem.SUNUCU.GUILD)
            this.users.getUser = GetUser;
            this.Upstaffs = {}
            this._statSystem = global._statSystem = {}
            this.getUser = GetUser;
            async function GetUser(id) { try { return await this.users.fetch(id); } catch (error) { return undefined; } };
            this.logger = require('../Global.Functions/Logger');
            this.cartelinEmbedi = global.cartelinEmbedi = require('../Reference/Embed');
            require('../Global.Functions/Dates');
            require('../Global.Functions/Numbers');
            require('../Bases/_sources');
            require('../Bases/_user');
            this.botİsmi;
            this.commands = new Collection();
            this.aliases = new Collection();
            this.setMaxListeners(10000);

           

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

        async fetchCommands(active = true, slash = false) {
            if(slash) {
                const slashcommands = await globPromise(`../../_BOTLAR/${this.botİsmi}/_slashcommands/*/*.js`);
                const arrSlash = [];
                slashcommands.map((value) => {
                    const file = require(value);
                    if (!file?.name) return;
                    this.slashcommands.set(file.name, file);
            
                    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
                    arrSlash.push(file);
                    
                });
                this.on("ready", async () => {
                    let fetchGuild = await this.guilds.cache.get(global.sistem.SUNUCU.GUILD)
                    if(fetchGuild) await fetchGuild.commands.set(arrSlash);
                })
            }
            if(!active) return;
            let dirs = fs.readdirSync("./_cartel", { encoding: "utf8" });
            this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
            await GUILD.fetch(this.sistem.SUNUCU.GUILD)
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
    
        async checkMember(id, type, process = "İşlem Bulunamadı.") {
            let guild = this.guilds.cache.get(sistem.SUNUCU.GUILD)
            if(!guild) return false;
            let cartelim = guild.members.cache.get(id)
            if(!cartelim) return;
            let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
            let Sunucu = await GUILD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
            if(!Sunucu) return false;
            if(!Whitelist) return false;
            let guildSettings = Sunucu.Ayarlar
            if(!guildSettings) return false;
            if(!Whitelist.guildProtection) return true;
            if(cartelim.id === this.user.id || cartelim.id === cartelim.guild.ownerId || Whitelist.unManageable.some(g => cartelim.id === g || cartelim.roles.cache.has(g)) || Whitelist.BOTS.some(g => cartelim.id === g || cartelim.roles.cache.has(g))|| guildSettings.staff.includes(cartelim.id)) return true; 
            if(!type) return false;
            switch (type) {
                case "guild": {
                    if(Whitelist.fullAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))  || Whitelist.guildAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))) return this.checkProcessLimit(cartelim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "emoji": {
                    if(Whitelist.fullAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))  || Whitelist.emojiAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))) return this.checkProcessLimit(cartelim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "bot": {
                    if(Whitelist.fullAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))  || Whitelist.botAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))) return this.checkProcessLimit(cartelim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "member": {
                    if(Whitelist.fullAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))  || Whitelist.memberAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))) return this.checkProcessLimit(cartelim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "channels": {
                    if(Whitelist.fullAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))  || Whitelist.channelsAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))) return this.checkProcessLimit(cartelim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "roles": {
                    if(Whitelist.fullAccess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))  || Whitelist.rolesAcess.some(g => cartelim.id === g || cartelim.roles.cache.has(g))) return this.checkProcessLimit(cartelim, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
            }
            return false;
        }

        async checkProcessLimit(cartelim, limit, zaman, process) {
            let id = cartelim.id
            let limitController = dataLimit.get(id) || []
            let type = { _id: id, proc: process, date: Date.now() }
            let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
            if(!Whitelist.limit) return true;
            limitController.push(type)
            dataLimit.set(id, limitController)
            setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms(zaman))
            if (limitController.length >= limit) { 
                let loged = cartelim.guild.kanalBul("guard-log");
                let taslak = `${cartelim} (\`${cartelim.id}\`) isimli güvenli listesinde ki yönetici işlem sınırını aştığı için "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Yapılan işlemleri;
${limitController.sort((a, b) => b.date - a.date).map((x, index) => `${index+1}. | ${x.proc} | ${tarihsel(x.date)}`).join("\n")}
                \`\`\``
                if(loged) loged.send(taslak);
                let taç = cartelim.guild.members.cache.get(cartelim.guild.ownerId)
                if(taç) taç.send(taslak).catch(err => {})
                return false 
            } else {
                return true
            }
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
        async queryManage(oldData, newData) {
            const guildSettings = require('../Databases/Schemas/Global.Guild.Settings');
            let veriData = await guildSettings.findOne({ guildID: sistem.SUNUCU.GUILD })
            let sunucuData = veriData.Ayarlar 
            if(sunucuData) {              
                if(oldData === sunucuData.tagRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.tagRolü": newData}})
                }
                if(oldData === sunucuData.muteRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.muteRolü": newData}})
                }
                if(oldData === sunucuData.jailRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.jailRolü": newData}})
                }
                if(oldData === sunucuData.şüpheliRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.şüpheliRolü": newData}})
                }
                if(oldData === sunucuData.yasaklıTagRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.yasaklıTagRolü": newData}})
                }
                if(oldData === sunucuData.vipRolü) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.vipRolü": newData}})
                }
                if(oldData === sunucuData.Katıldı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.Katıldı": newData}})
                }
                if(oldData === sunucuData.altilkyetki) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.altilkyetki": newData}})
                }
                if(oldData === sunucuData.etkinlikKatılımcısı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.etkinlikKatılımcısı": newData}})
                }
                if(oldData === sunucuData.cekilisKatılımcısı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.cekilisKatılımcısı": newData}})
                }
                if(oldData === sunucuData.TerfiLog) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.TerfiLog": newData}})
                }
                if(oldData === sunucuData.kurallarKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.kurallarKanalı": newData}})
                }
                if(oldData === sunucuData.hoşgeldinKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.hoşgeldinKanalı": newData}})
                }
                if(oldData === sunucuData.chatKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.chatKanalı": newData}})
                }
                if(oldData === sunucuData.toplantıKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.toplantıKanalı": newData}})
                }
                if(oldData === sunucuData.davetKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.davetKanalı": newData}})
                }
                if(oldData === sunucuData.publicKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.publicKategorisi": newData}})
                }
                if(oldData === sunucuData.registerKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.registerKategorisi": newData}})
                }
                if(oldData === sunucuData.streamerKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.streamerKategorisi": newData}})
                }
                if(oldData === sunucuData.photoChatKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.photoChatKanalı": newData}})
                }
                if(oldData === sunucuData.sleepRoom) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.sleepRoom": newData}})
                }
                if(oldData === sunucuData.başlangıçYetki) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.başlangıçYetki": newData}})
                }
                if(sunucuData.erkekRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.erkekRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.erkekRolleri": newData}})
                }
                if(sunucuData.kadınRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.kadınRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.kadınRolleri": newData}})
                }
                if(sunucuData.kayıtsızRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.kayıtsızRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.kayıtsızRolleri": newData}})
                }
                if(sunucuData.Yetkiler.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.Yetkiler": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.Yetkiler": newData}})
                }
                if(sunucuData.teyitciRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.teyitciRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.teyitciRolleri": newData}})
                }
                if(sunucuData.kurucuRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.kurucuRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.kurucuRolleri": newData}})
                }
                if(sunucuData.ayrıkKanallar.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.ayrıkKanallar": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.ayrıkKanallar": newData}})
                }
                if(sunucuData.izinliKanallar.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.izinliKanallar": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.izinliKanallar": newData}})
                }
                if(sunucuData.rolPanelRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.rolPanelRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.rolPanelRolleri": newData}})
                }
                if(sunucuData.üstYönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.üstYönetimRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.üstYönetimRolleri": newData}})
                }
                if(sunucuData.altYönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.altYönetimRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.altYönetimRolleri": newData}})
                }
                if(sunucuData.yönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.yönetimRolleri": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.yönetimRolleri": newData}})
                }

                if(sunucuData.banHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.banHammer": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.banHammer": newData}})
                }
                if(sunucuData.jailHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.jailHammer": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.jailHammer": newData}})
                }
                if(sunucuData.voiceMuteHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.voiceMuteHammer": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.voiceMuteHammer": newData}})
                }
                if(sunucuData.muteHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.muteHammer": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.muteHammer": newData}})
                }

                if(sunucuData.warnHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.warnHammer": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.warnHammer": newData}})
                }
                if(sunucuData.coinChat.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$pull: {"Ayarlar.coinChat": oldData}})
                    await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"Ayarlar.coinChat": newData}})
                }       
            }
        }

       async punitivesAdd(id, type) {
            let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD)
            if(!guild) return;
            let cartelim = guild.members.cache.get(id)
            if (!cartelim) return;
            if (type == "jail") { 
                if(cartelim.voice.channel) cartelim.voice.disconnect().catch(err => {})
                return cartelim.setRoles(roller.şüpheliRolü)
            }
            if (type == "ban") return cartelim.ban({ reason: "Guard Tarafından Siki Tuttu." }).catch(async (err) => {
          
            }) 
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
                this.on("ready", async () => { 
                    let guild = client.guilds.cache.get(global.sistem.SUNUCU.GUILD);
                    if(!guild) {
                        console.log(`https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=0&scope=bot%20applications.commands`)
                        return process.exit();
                    }
                    this.Upstaffs = require('../Additions/Staff/_index');
                    this._statSystem = global._statSystem = require('../../_SYSTEM/Additions/Staff/Sources/_settings');
                    if(this.botİsmi == "Orion" || this.botİsmi == "FIREWALL_ONE") {
                        let kanal = this.channels.cache.get(global.ayarlar ? global.ayarlar.botSesKanalı : "123")
                        if(kanal) joinVoiceChannel({ channelId: kanal.id, guildId: kanal.guild.id, adapterCreator: kanal.guild.voiceAdapterCreator });
                        this.user.setPresence({ activities: [{name: global.sistem.botStatus.Name}], status: global.sistem.botStatus.Status })
                    } else {
                        setTimeout(() => {
                            client.user.setPresence({
                                activities: [{ name: sistem.botStatus.Name, url: sistem.botStatus.Url, type: sistem.botStatus.type }],
                                status: "dnd"
                            });
                            
                    }, 2000)
                }
                    if(this.botİsmi == "FIREWALL_THREE" || this.botİsmi == "FIREWALL_FOUR") {
                        let kanal = this.channels.cache.get(sistem.SUNUCU.VoiceChannelID)
                        if(kanal) joinVoiceChannel({ channelId: kanal.id, guildId: kanal.guild.id, adapterCreator: kanal.guild.voiceAdapterCreator});
                        this.user.setPresence({ activities: [{name: global.sistem.botStatus.Name}], status: global.sistem.botStatus.Status })
                    } else {
                        setTimeout(() => {
                            client.user.setPresence({
                                presence: {name: sistem.botStatus.Name, status: sistem.botStatus.Status, type: sistem.botStatus.type,url: sistem.botStatus.Url}
                            });
                            
                    }, 2000)
                }
                    if(guild) await guild.members.fetch().then(fetchedMembers=> { })
                    let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
                    if(!Whitelist) await GUARD_SETTINGS.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"auditLimit": 10, auditInLimitTime: "2m"}}, {upsert: true})
                })
                this.on("ready", () => {
                    setInterval(async () => {
                        client.user.setPresence({
                            activities: [{ name: sistem.botStatus.Name, url: sistem.botStatus.Url, type: sistem.botStatus.type }],
                            status: "dnd"
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