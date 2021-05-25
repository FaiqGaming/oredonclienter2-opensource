const { MessageEmbed } = require("discord.js");

const { COLOR } = require("../config.json");

module.exports = {
  name: "pause",
  usage: "o!pause",
  guildOnly: true,
  description: "Pause the currently playing song",
  run(client, message, args) {
    const { queue } = require("../server.js");
    const { channel } = message.member.voice;

    if (!channel) {
      return message.channel.send(
        ":x: I'm sorry but you need to be in a voice channel!"
      );
    }

    const serverQueue = queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send(
        "⚠ There is nothing playing that I could pause for you."
      );
    }

    if (serverQueue && channel !== message.guild.me.voice.channel)
      return msg.channel.send(`⚠ You must be in the same voice channel as me to run this command!`);

    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true);

      return message.channel.send("⏸ **|** Paused the music for you!");
    }
  }
};
