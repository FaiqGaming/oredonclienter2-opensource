const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  guildOnly: true,
  usage: "o!lyrics [will checking all lyrics from your current song]",
  description: "Get lyrics for the currently playing song",
  async run(client, msg, args) {
    const queue = msg.client.queue.get(msg.guild.id);
    if (!queue) return msg.channel.send("⚠ There is nothing playing.").catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `:x: No lyrics found for ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `:x: No lyrics found for ${queue.songs[0].title}.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle("Lyrics")
      .setDescription(lyrics)
      .setColor("#Ffffff")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return msg.channel.send(lyricsEmbed).catch(console.error);
  }
};