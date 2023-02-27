const { Client, Message} = Discord = require("discord.js");
const children = require("child_process");

module.exports = {
    Isim: "pm2",
    Komut: ["pm2-controller"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let ids = ["719117042904727635"]
    if(!ids.includes(message.member.id)) return;
    const ls = children.exec(`pm2 ${args.join(' ')}`);
    ls.stdout.on('data', function (data) {
        const arr = Discord.Util.splitMessage(data, { maxLength: 1950, char: "\n" });
        arr.forEach(element => {
            message.channel.send(Discord.Formatters.codeBlock("js", element));
        });
    });
    }
};