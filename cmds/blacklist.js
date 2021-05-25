const Discord = require('discord.js');
const { promptMessage } = require('../function.js')

module.exports = {
  name: "blacklist",
  aliases: ["bl"],
  guildOnly: true,
  usage: "o! [users]",
  description: "Blacklisted a users from this bot",
  async run(client, msg, args) {
    if (msg.author.id !== "297130271864520705") return msg.channel.send('Only owners can run this command!')
    if (!args[0]) {
    } else if (args[0] == "add") {
      let users = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
      if (!users) {
        return msg.channel.send("Please specify a users to blacklist!").then(m => m.delete({ timeout: 5000 }));
      }
      let blacklist = client.guild.get(`blacklist.${users.id}`)
      
      if (users.user.bot == true) return msg.channel.send("You can't blacklist a bot!")
      if (msg.author.id === users.id) return msg.channel.send("You can't blacklist yourself, try again!")

      let verification = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor('Verification for blacklist this user have 30 sec for blacklist him!')
      .setDescription(`Are you sure? want to blacklist ${users.user.tag}`)
      await msg.channel.send(verification).then(async msg2 => {
        const emoji = await promptMessage(msg2, msg.author, 30, ["❌", "✅"]);

        if (emoji === "✅") {
          msg.delete()
          client.guild.set(`blacklist.${users.id}`, true)
          msg.channel.send(`${users} has been blacklisted!`).then(d => d.delete({ timeout: 5000 }))
        } else if (emoji === "❌") {
          msg.delete()

          msg.channel.send(`Succesfully cancelling blacklisting this user!`).then(d => d.delete({ timeout: 5000 }))
        }
      })
    } else if(args[0] == "remove") {
      let users = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
      if (!users) {
        return msg.channel.send("Please specify a users to unblacklist!").then(m => m.delete({ timeout: 5000 }));
      }
      if (users.user.bot == true) return msg.channel.send("You can't unblacklist a bot!")
      if (msg.author.id === users.id) return msg.channel.send("You can't unblacklist yourself, try again!")

      let verification = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor('Verification for unblacklist this user have 30 sec for unblacklist him!')
      .setDescription(`Are you sure? want to unblacklist ${users.user.tag}`)
      await msg.channel.send(verification).then(async msg2 => {
        const emoji = await promptMessage(msg2, msg.author, 30, ["❌", "✅"]);

        if (emoji === "✅") {
          msg.delete()
          client.guild.set(`blacklist.${users.id}`, false)
          msg.channel.send(`${users} has been unblacklisted!`).then(d => d.delete({ timeout: 5000 }))
        } else if (emoji === "❌") {
          msg.delete()

          msg.channel.send(`Succesfully cancelling unblacklisting this user!`).then(d => d.delete({ timeout: 5000 }))
        }
      })
    }
  }// dqieu dqdlq {
  //  If user { by params and another params i will do something }
  // dqqqwp
  //}
}