module.exports = {
  name: "antibadword",
  async exec(client, msg, messageArray, prefix) {
    try {
      let badwordMode = client.guild.get(`guild.${msg.guild.id}.badword.type`);
      let badwordWord = client.guild.get(`guild.${msg.guild.id}.badword.word`);
      if (!badwordWord) badwordWord = [];
      if (!badwordMode && badwordMode == false) return;
      // Jika anti badwordnya aktif maka dia akan menjalankan sistem anti badword.
      if (badwordMode == true) {
        // Jika user tersebut tidak memiliki permission MANAGE_MESSAGES
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
          // Loop isi didalam blacklist word.
          for (let i of badwordWord) {
            // Jika user yg mengirim kata kata badword tersebut adalah bot / Jika badword tersebut berawalan dengan prefix maka tidak dijalankan sistem anti badword
            if (
              msg.author.bot === true ||
              msg.content.toLowerCase().startsWith(prefix)
            )
              return;
            if(msg.content.toLowerCase().replace(/[^0-9a-z]/gi, '').split(" ").filter(x => x == i).length > 0) {
              msg.delete();
              return msg.channel
                .send(`Hey ${msg.author}!, Don't speak harshly on this server!`)
                .then(x => x.delete({ timeout: 5000 }));
            }
          }
        }
      }
    } catch (e) {
      console.log(e.stack);
    }
  }
};
