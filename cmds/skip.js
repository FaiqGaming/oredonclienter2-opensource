module.exports = {
  name: "skip",
  usage: "o!skip",
  guildOnly: true,
  description: "Skip the song or shift yourself to next song",
  async run(client, msg, args) {
    const { MessageEmbed } = require("discord.js");
    const { COLOR } = require("../config.json");

    const Discord = require("discord.js");

    const { queue } = require("../server.js");

    let serverQueue = queue.get(msg.guild.id);
    if (!msg.member.voice.channel)
      return msg.channel.send(
        ":x: I'm sorry but you need to be in a voice channel!"
      );
    if (!serverQueue)
      return msg.channel.send(
        "⚠ There is nothing playing that I could skip for you."
      );
    if (serverQueue && msg.member.voice.channel !== msg.guild.me.voice.channel)
      return msg.channel.send(`⚠ You must be in the same voice channel as me to run this command!`);
    serverQueue.connection.dispatcher.end("Skip command has been used!");
    return msg.channel.send("⏭️ Song has been skipped!");
    return undefined;
  }
};
