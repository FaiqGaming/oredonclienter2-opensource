const ytsr = require("youtube-sr")
const { Client, Collection, MessageEmbed } = require("discord.js");
const { PREFIX, } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "filters",
  description: "Set Audio - Effects",
  aliases: ["fi", "filter"],
  cooldown: 3,
  edesc: `Type this Command to change the current audio effect - style \nUsage: ${PREFIX}filter <Filtertype>`,
  async run(client, msg, args) {
    let message = msg;
    let { channel } = message.member.voice;
    let queue = client.queue.get(message.guild.id);
    if (!queue)
      return msg.channel.send(
        "⚠ There is nothing playing that I could skip for you."
      );
    if (!message.member.voice.channel)
      return msg.channel.send(":x: I'm sorry but you need to be in a voice channel to play music!")
    //If not in the same channel return error
    if (queue && channel !== message.guild.me.voice.channel)
      return msg.channel.send(`⚠ You must be in the same voice channel as me to run this command!`);
    //Define all filters with ffmpeg    https://ffmpeg.org/ffmpeg-filters.html
    const filters = [
      'bass=g=20,dynaudnorm=f=200',//bassboost
      'apulsator=hz=0.08', //8D
      'aresample=48000,asetrate=48000*0.8',//vaporwave
      'aresample=48000,asetrate=48000*1.25',//nightcore
      'aphaser=in_gain=0.4',//phaser
      'tremolo',//tremolo
      'vibrato=f=6.5',//vibrato
      'surround',//surrounding
      'apulsator=hz=1',//pulsator
      'asubboost',//subboost
      "dynaudnorm=f=200",
    ];
    //set some temporary variables
    let varforfilter; let choice;
    //get user input
    switch (args[0]) {
      case "bassboost":
        varforfilter = 0;

        break;
      case "8D":
        varforfilter = 1;
        break;
      case "vaporwave":
        varforfilter = 2;
        break;
      case "nightcore":
        varforfilter = 3;
        break;
      case "phaser":
        varforfilter = 4;
        break;
      case "tremolo":
        varforfilter = 5;
        break;
      case "vibrato":
        varforfilter = 6;
        break;
      case "surrounding":
        varforfilter = 7;
        break;
      case "pulsator":
        varforfilter = 8;
        break;
      case "subboost":
        varforfilter = 9;
        break;
      case "clear":
      varforfilter = 10;
      break;
      default:
        //fires if not valid input
        varforfilter = 404;
        message.channel.send(new MessageEmbed()
        .setColor("#c219d8")
        .setTitle("Not a valid Filter, use one of those:")
        .setDescription(`
        \`bassboost\`
        \`8D\`
        \`vaporwave\`
        \`nightcore\`
        \`phaser\`
        \`tremolo\`
        \`vibrato\`
        \`surrounding\`
        \`pulsator\`
        \`subboost\`
        \`clear\`   ---  removes all filters`)
        .setFooter(`Example: ${PREFIX}filter bassboost`)
        )
        break;
    }
    //set choice to zero
    choice = filters[varforfilter];
    if (varforfilter === 404) return;
    try {

      const song = queue.songs[0];
      //play the collected song song, message, client, filters
      message.channel.send(new MessageEmbed()
      .setColor("#c219d8")
      .setAuthor("Applying: " + args[0])).then(msg =>{
        msg.delete({timeout: 2000});
      })
      const { play } = require("../server.js")
      if (!queue.encoderArgs[1]) {
        queue.encoderArgs.push(choice)
        play(msg.guild, song, msg)
      } else{
        queue.encoderArgs.splice(1)
        queue.encoderArgs.push(choice)
        play(msg.guild, song, msg)
      }
      //catch any errors while searching
    } catch (error) {
      //log them
      console.error(error);
    }
  }
}