const { MessageEmbed } = require("discord.js");

const { COLOR } = require("../config.json");

module.exports = {
  name: "np",
  aliases: ['nowplaying'],
  description: "Get the name of current playing song",
  guildOnly: true,
  usage: "o!np [Will check the currently playing song]",
  async run(client, msg, args) {
/*    let embed = new MessageEmbed().setColor(COLOR);
    const { queue } = require("../server.js");
    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send(
        ":x: I'm sorry but you need to be in a voice channel!"
      );
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("⚠ There is nothing playing.");
      return message.channel.send(embed);
    }

    embed.setDescription(
      `🎶  **|**  Now Playing: **\`${serverQueue.songs[0].title}\`**`
    );
    message.channel.send(embed);
    */
      try {
    const serverQueue = client.queue.get(msg.guild.id);
    if (!serverQueue)
      return msg.channel.send('⚠️ There is nothing playing.');
    const duration =
      serverQueue.songs[0].duration.minutes * 60000 +
      (serverQueue.songs[0].duration.seconds % 60000) * 1000;
    const persentase = serverQueue.connection.dispatcher.streamTime / duration;
    const curentDurationMinute =
      Math.floor(serverQueue.connection.dispatcher.streamTime / 60000) < 10
        ? `0${Math.floor(serverQueue.connection.dispatcher.streamTime / 60000)}`
        : Math.floor(serverQueue.connection.dispatcher.streamTime / 60000);
    const currentDurationSeconds =
      Math.floor(
        (serverQueue.connection.dispatcher.streamTime % 60000) / 1000
      ) < 10
        ? `0${Math.floor(
            (serverQueue.connection.dispatcher.streamTime % 60000) / 1000
          )}`
        : Math.floor(
            (serverQueue.connection.dispatcher.streamTime % 60000) / 1000
          );

    const endDurationMinute =
      serverQueue.songs[0].duration.minutes < 10
        ? `0${serverQueue.songs[0].duration.minutes}`
        : serverQueue.songs[0].duration.minutes;
    const endDurationSeconds =
      serverQueue.songs[0].duration.seconds < 10
        ? `0${serverQueue.songs[0].duration.seconds}`
        : serverQueue.songs[0].duration.seconds;

    const emb = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(
        serverQueue.songs[0].authors.tag,
        serverQueue.songs[0].authors.avatarURL()
      )
      .setTitle(serverQueue.songs[0].title)
      .setURL(serverQueue.songs[0].url)
      .setThumbnail(`https://i.ytimg.com/vi/${serverQueue.songs[0].id}/default.jpg?width=80&height=60`)
      .setDescription(
        `▶ ${progressBar(
          persentase
        )} \`[${curentDurationMinute}:${currentDurationSeconds} - ${endDurationMinute}:${endDurationSeconds}]\` 🔊`
      );

    return msg.channel.send("🎶 **Now playing...**", { embed: emb });
  } catch (e) {
    msg.channel.send(`Oh no an error occurred :( \`${e}\` try again later.`);
  }
}
}


function progressBar(percent) {
  let num = Math.floor(percent * 12);
  if (num === 1) {
    return "🔘▬▬▬▬▬▬▬▬▬▬▬";
  } else if (num === 2) {
    return "▬🔘▬▬▬▬▬▬▬▬▬▬";
  } else if (num === 3) {
    return "▬▬🔘▬▬▬▬▬▬▬▬▬";
  } else if (num === 4) {
    return "▬▬▬🔘▬▬▬▬▬▬▬▬";
  } else if (num === 5) {
    return "▬▬▬▬🔘▬▬▬▬▬▬▬";
  } else if (num === 6) {
    return "▬▬▬▬▬🔘▬▬▬▬▬▬";
  } else if (num === 7) {
    return "▬▬▬▬▬▬🔘▬▬▬▬▬";
  } else if (num === 8) {
    return "▬▬▬▬▬▬▬🔘▬▬▬▬";
  } else if (num === 9) {
    return "▬▬▬▬▬▬▬▬🔘▬▬▬";
  } else if (num === 10) {
    return "▬▬▬▬▬▬▬▬▬🔘▬▬";
  } else if (num === 11) {
    return "▬▬▬▬▬▬▬▬▬▬🔘▬";
  } else if (num === 12) {
    return "▬▬▬▬▬▬▬▬▬▬▬🔘";
  } else {
    return "🔘▬▬▬▬▬▬▬▬▬▬▬";
  }
}