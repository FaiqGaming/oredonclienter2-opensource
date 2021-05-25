const { MessageEmbed } = require("discord.js");
const { COLOR } = require("../config.json");

const discord = require("discord.js");

module.exports = {
  name: "stop",
  usage: "o!stop (stopping music)",
  guildOnly: true,
  description: "Stop the music and take rest ;)",
  run(client, msg, args) {
    const { queue } = require("../server.js");

    let serverQueue = queue.get(msg.guild.id);
    if (!msg.member.voice.channel)
      return msg.channel.send(
        ":x: I'm sorry but you need to be in a voice channel!"
      );
    if (!serverQueue)
      return msg.channel.send(
        "⚠ There is nothing playing that I could stop for you."
      );
    if (serverQueue && msg.member.voice.channel !== msg.guild.me.voice.channel)
      return msg.channel.send(`⚠ You must be in the same voice channel as me to run this command!`);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
    return msg.channel.send("⏹ Song has been stopped!");
    return undefined;
  }
};