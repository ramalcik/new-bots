const { Client, Collection, Constants, Intents, Options } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const fs = require('fs')
const { bgBlue, black, green } = require("chalk");
global.sistem = global.system = require('../GlobalSystem/server.json');
const DISCORD_LOGS = require('discord-logs')
const { GUILD } = require('../../_SYSTEM/Reference/Settings');
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
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
            process.on("multipleResolves", (type, promise, reason) => {
                if (reason.toLocaleString() === "Error: Cannot perform IP discovery - socket closed") return;
            });
            this.logger = require('../Global.Functions/Logger');
            this.cartelinEmbedi = global.cartelinEmbedi = require('../Reference/Embed');
            this.Upstaffs = {}
            this._statSystem = global._statSystem = {}
            require('../Global.Functions/Dates');
            require('../Global.Functions/Numbers');
            require('../Bases/_sources');
            require('../Bases/_user');
            this.botİsmi;
            this.commands = new Collection();
            this.slashcommands = new Collection();
            this.aliases = new Collection();
            this.eventEmitter = new EventEmitter();
            this.setMaxListeners(10000);

            // Plugins (Stat / Yetkili / Economy)

          
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

        connect(token) {
            if(!token) {
                this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`,"error");
                process.exit()
                return;
            }
            this.login(token).then(munur => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botİsmi.toUpperCase())} BOT kullanıma aktif edilmiştir.`,"botReady")
                this.user.setPresence({ activities: [{name: global.sistem.botStatus.Name}], status: global.sistem.botStatus.Status })
                this.on("ready", async () => {
                    let guild = client.guilds.cache.get(global.sistem.SUNUCU.GUILD);
                    if(!guild) {
                        console.log(`https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=0&scope=bot%20applications.commands`)
                        return process.exit();
                    }
                    this.Upstaffs = require('../Additions/Staff/_index');
                    this._statSystem = global._statSystem = require('../../_SYSTEM/Additions/Staff/Sources/_settings');
                    
                    
                    if (guild) await guild.members.fetch().then(fetch => { })
                    let kanal = this.channels.cache.get(global.ayarlar ? global.ayarlar.botSesKanalı : "123")
                    if (kanal) joinVoiceChannel({ channelId: kanal.id, guildId: kanal.guild.id, adapterCreator: kanal.guild.voiceAdapterCreator });
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