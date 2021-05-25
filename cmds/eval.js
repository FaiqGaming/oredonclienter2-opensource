const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core");
const { post } = require("snekfetch");
const randomstring = require("randomstring");
const db = require('quick.db');

const warningTokenMessage = ["Token not found!", "Couldn't find token"];

module.exports = {
  name: "eval",
  aliases: ["e"],
  description: "Evaluate some code",
  usage: "o!eval <evaluate code>",
  guildOnly: true,
  cooldown: 0,
  async run(client, msg, args) {
    if (msg.author.id !== "297130271864520705") return msg.channel.send('Only owners can run this command!');
    if (!args[0]) return msg.channel.send("You missing 1 argument in here.");

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .addField("📥 | Input", "```js\n" + args.join(" ") + "```");
    var bot = client;
    var message = msg;
    try {
      let code = args.join(" ");
      let evaled;
      if (code.includes(`token`)) {
        evaled =
          warningTokenMessage[
            Math.floor(Math.random() * warningTokenMessage.length)
          ];
        console.log(
          `${msg.author.tag} use this eval to against the tokens and privacy.`
        );
      } else {
        evaled = await eval(code);
        //let type = evaled && evaled.constructor ? evaled.constructor.name : typeof evaled;
        //if (evaled instanceof Promise) {
        //  evaled = await eval(code);
       // }
      }
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, { depth: 0 });
      let output = clean(evaled);
      if (output.length > 1024) {
        const { body } = await post("https://bin.renzyh.xyz/documents").send(output);
        embed.addField("📤 | Output", `https://bin.renzyh.xyz/${body.key}.js`);
      } else {
        embed.addField("📤 | Output", "```js\n" + output + "```");
      }
      message.channel.send(embed);
    } catch (e) {
      let error = clean(e);
      if (error.length > 1024) {
        const { body } = await post("https://bin.renzyh.xyz/documents").send(error);
        embed.addField("❌ | Error", `https://bin.renzyh.xyz/${body.key}.js`);
      } else {
        embed.addField("❌ | Error", "```js\n" + error + "```");
      }
      message.channel.send(embed);
    }
  }
};

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}
