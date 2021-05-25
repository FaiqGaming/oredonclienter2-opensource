const Discord = require("discord.js");
const Test = require("../database/mongodb/blacklist.js");
const mongoose = require('mongoose');

module.exports = {
  name: "test",
  usage: "o!test",
  guildOnly: true,
  description: "Testing an commands",
  run(client, msg, args) {
    mongoose.connect('mongodb+srv://MyData:AkuGanteng12@cluster0.qtcxe.mongodb.net/oreguild?retryWrites=true&w=majority');
    let user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
    if (!user) return msg.reply(' specify a user!')
    
    const test = new Test({
      _id: mongoose.Types.ObjectId(),
      userName: user.user.username,
      userID: user.id,
      time: msg.createdAt,
      type: true
    })
    test.save()
    .then(res => console.log(res))
    .catch(err => console.log(err))
    msg.reply("That report has been saved to the database!")
  }
}