const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["kontl"],
  description: "Check bot's connection of API and Latency",
  cooldown: 5,
  usage: "o!ping",
  guildOnly: true,
  run(client, message, args) {
    let start = Date.now();
    let bot = message.client;
    let diff = Date.now() - start;
    let API = bot.pings.toFixed(2);
    let embed = new MessageEmbed()
      .setTitle(`:ping_pong: Pong!`)
      .setColor(`RANDOM`)
      .addField("Latency", `${diff}ms`, true)
      .addField("API", `${API}ms`, true);
    message.channel.send(embed).then(msg => msg.delete({ timeout: 5000}));
  }
};
