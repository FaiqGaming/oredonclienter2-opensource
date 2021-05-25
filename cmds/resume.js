const { MessageEmbed } = require("discord.js");

const { COLOR } = require("../config.json");

module.exports = {
  name: "resume",
  usage: "o!resume",
  guildOnly: true,
  description: "Resume the currently playing song",
  run(client, message, args) {
    const { queue } = require("../server.js");
    const { channel } = message.member.voice;

    if (!channel) {
      return message.channel.send(
        ":x: I'm sorry but you need to be in a voice channel!"
      );
    }

    const serverQueue = queue.get(message.guild.id);
    
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return msg.channel.send(`⚠ You must be in the same voice channel as me to run this command!`);

    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();

      return message.channel.send("▶ **|** Resumed the music for you!");
    }
    return message.channel.send(
      "⚠ There is nothing playing / paused that I could resume for you."
    );
  }
};
