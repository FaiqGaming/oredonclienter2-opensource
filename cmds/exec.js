const { exec } = require('child_process');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "exec",
  aliases: ['execute', 'bash'],
  description: "Executes a command in the Terminal (Linux/macOS) or Command Prompt (Windows) and shows the output",
  usage: "o!exec <process code>",
  guildOnly: true,
  cooldown: 0,
  async run(client, message, args) {
    if (message.author.id !== "297130271864520705") return;
  
  if(!args.join(' ')) return message.channel.send('No parameter to execute. you\'re stuppid');
  const mu = Date.now();
  const emb = new MessageEmbed()
  .setColor('#81FF00')
  exec(args.join(' '), async( error, stdout, stderr)=> {
  	if(stdout){
	  	let output = `\`\`\`bash\n${stdout}\`\`\``;
	  	if(stdout.length > 2047){
			output = await client.util.hastebin(stdout);
		  }
			emb.setDescription(output);
  	}else if(stderr){
  	    emb.setColor('#FF0000');
	  	let error = `\`\`\`bash\n${stderr}\`\`\``;
	  	if(stderr.length > 2047){
			error = await client.util.hastebin(stderr);
		  }
			emb.setDescription(error);
  	}else{
	  	emb.setDescription('\`\`\`bash\n# Command executed successfully but returned no output.\`\`\`');
  	}
	  return message.channel.send(emb.setFooter(`\`${Date.now() - mu}ms\``));
  });
  }
}