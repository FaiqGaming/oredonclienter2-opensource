const Discord = require("discord.js");
const os = require("os");
const cpuStat = require("cpu-stat");
const moment = require("moment");

module.exports = {
  name: "stats",
  run: async(bot, message, args) => {
  let { version } = require("discord.js");
  let dev = await bot.users.fetch("297130271864520705")
  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }
    
    function duration(ms) {
      let secs = Math.floor((ms / 1000) % 60).toString();
      let days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
      let hours = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
      let mins = Math.floor((ms / (1000 * 60)) % 60).toString();
      return `${days.padStart(1, '0')}d ${hours.padStart(2, '0')}h ${mins.padStart(2, '0')}m ${secs.padStart(2, '0')}sec`
    }
    
    let embedStats = new Discord.MessageEmbed()
      .setTitle("** Oredon Clienter - 2's statistic **", bot.user.displayAvatarURL())
      .setColor("#00ff00")
      .addField(
        "• Mem Usage",
        `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}mb`,
        true
      )
      .addField("• Developer ", `\* **MesaRadar12#9104, \* 
      \* ${dev.username}#8455** \*`, true)
      .addField("• Uptime ", `${require('../util.js').parseDur(bot.uptime)}`, true)
      .addField("• Users", `${bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`, true)
      .addField("• Servers", `${bot.guilds.cache.size.toLocaleString()}`, true)
      .addField("• Channels ", `${bot.channels.cache.size.toLocaleString()}`, true)
      .addField("• Discord.js", `v${version}`, true)
      // .addField("• Node", `${process.version}`, true)
      .addField(
        "• CPU",
        `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``
      )
      .addField("• CPU usage", `\`${percent.toFixed(2)}%\``, true)
      .addField("• Websocket", `\`\`${bot.ws.ping.toFixed(2)}ms\`\``, true)
      .addField("• Arch", `\`${os.arch()}\``, true)
      .addField("• Platform", `\`\`Linux\`\``, true)
      .setTimestamp()
      .setFooter(message.author.username, message.author.displayAvatarURL());

    message.channel.send('<a:loading1:556656187156725801> Please wait for getting bot\'s statistic...').then(async (m) => {
      setTimeout(async() => {
        m.delete()
        await message.channel.send(embedStats)
      }, 5000)
    });
  });
}
}