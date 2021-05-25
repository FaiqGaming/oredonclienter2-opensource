const { MessageEmbed } = require("discord.js");
const { COLOR } = require("../config.json");

module.exports = {
  name: "loop",
  description: "Looping your current queue",
  usage: "o!loop (the looping will be toggle)",
  guildOnly: true,
  run(client, message, args) {
    const { queue } = require("../server.js");

    const { channel } = message.member.voice;
    let embed = new MessageEmbed().setColor("RANDOM");
    if (!channel) {
      return message.channel.send(
        ":x: I'm sorry but you need to be in a voice channel!"
      );
    }

    const serverQueue = queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send(
        "⚠ There is nothing playing that I could loop for you."
      );
    }

    if (serverQueue && channel !== message.guild.me.voice.channel)
      return msg.channel.send(`⚠ You must be in the same voice channel as me to run this command!`);

    serverQueue.loop = !serverQueue.loop;

    embed.setDescription(
      `🔁 **|** Loop is now **\`${
        serverQueue.loop ? "enabled" : "disabled"
      }\`**`
    );
    message.channel.send(embed);
  }
};
