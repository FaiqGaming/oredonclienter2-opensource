module.exports = {
  name: "play",
  aliases: ["p"],
  usage: "o!play [Song Name]",
  guildOnly: true,
  description: "Play the song and feel the music",
  async run(client, msg, args) {
    const { MessageEmbed } = require("discord.js");

    const ms = require("ms");
    const { prefix } = require("../config.json");
    const { Util } = require("discord.js");
    const { queue, handleVideo } = require("../server.js");
    const { YOUTUBE_API_KEY, QUEUE_LIMIT, COLOR } = require("../config.json");
    const ytdl = require("discord-ytdl-core");
    const YouTube = require("simple-youtube-api");
    const youtube = new YouTube(YOUTUBE_API_KEY);

    const searchString = args.join(" ");
    const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
    const serverQueue = client.queue.get(msg.guild.id);

    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel)
      return msg.channel.send(
        ":x: I'm sorry but you need to be in a voice channel to play music!"
      );
    if (serverQueue && voiceChannel !== msg.guild.me.voice.channel)
      return msg.channel.send(`⚠ You must be in the same voice channel as me to run this command!`);
    if (!args[0])
      return msg.channel.send(
        `Please following the code! : ${prefix}play **[Song Name/URL/Playlist URL]**`
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.send(
        "I cannot connect to your voice channel, make sure I have the proper permissions!"
      );
    }
    if (!permissions.has("SPEAK")) {
      return msg.channel.send(
        "I cannot speak in this voice channel, make sure I have the proper permissions!"
      );
    }
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel.send(
        `✅ Playlist: **${playlist.title}** has been added to the queue!`
      );
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;
          let embedplay = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Song selection")
            .setDescription(
              `${videos
                .map(video2 => `**${++index} -** ${video2.title}`)
                .join("\n")}`
            )
            .setFooter(
              "Please provide a value to select one of the search results ranging from 1-10."
            );
          msg.channel.send(embedplay);
          // eslint-disable-next-line max-depth
          try {
            var response = await msg.channel.awaitMessages(
              msg2 => msg2.content > 0 && msg2.content < 11,
              {
                max: 1,
                time: 10000,
                errors: ["time"]
              }
            );
          } catch (err) {
            console.error(err);
            return msg.channel.send(
              "No or invalid value entered, cancelling video selection."
            );
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send("🆘 I could not obtain any search results.");
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  }
};
