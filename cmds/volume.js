const { MessageEmbed } = require("discord.js");

const { COLOR, prefix } = require("../config.json");
module.exports = {
  name: "volume",
  aliases: ["vol"],
  guildOnly: true,
  usage: "o!volume [0 - 100]",
  description: "Manage the volume of the song",
  async run(client, message, args) {
    let embed = new MessageEmbed().setColor(COLOR);
        client.rbl.isVoteMe(message.author.id).then(voted => {
      if (!voted)
      return message.channel.send({
        embed: {
          color: 0xff0000,
          description: `Hey! ${message.author} you must vote first before using this features! [Click Here](https://renzyh.xyz/vote/720935692485787689)`
        }
      });
    if (voted) {
      const { channel } = message.member.voice;    
      if (!channel) {
        return message.channel.send(
          ":x: I'm sorry but you need to be in a voice channel!"
        );
      }

      const serverQueue = client.queue.get(message.guild.id);

      if (!serverQueue) {
        return message.channel.send("⚠️ There is nothing playing");
      }

      if (serverQueue && channel !== message.guild.me.voice.channel)
      return msg.channel.send(`⚠ You must be in the same voice channel as me to run this command!`);

      if (!args[0]) {
        return message.channel.send(
          `📶 The current volume is: **${serverQueue.volume}**%`
        );
      }

      if (isNaN(args[0])) {
        return message.channel.send(`${prefix}volume [0 - 100]`);
      }

      if (args[0] > 200) {
        return message.channel.send(
          `Volume only can be set in a range of **\`[0]\`** - **\`[100]\`**`
        );
      }
      serverQueue.volume = args[0];
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
      message.channel.send(`📶 I set the volume to: **${args[0]}**`);
    }
  })
  }
};
