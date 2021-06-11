const Discord = require('discord.js');
const express = require('express');
let app = express();
const db = require('quick.db');
const blacklist = require('./database/mongodb/blacklist.js');
/* const mongoose = require('mongoose') */
const { prefix, token, token2 } = require('./config.json');
const fs = require('fs');
//var exports = {}
/* Handler */
const badwordHandler = require('./antibadword');
/* End handler */
const OredonClient = require("./Structures/OredonClient.js");
const { Collection, Util, MessageEmbed } = require('discord.js');
const client = new OredonClient({ 
  disableMentions: "true" 
});
const ytdl = require('discord-ytdl-core');
const moment = require('moment');
let cooldowns = client.cooldown;
let queue = client.queue;
require('./Structures/inlineReply');
/* The command handler */
['command'].forEach(handler => {
	require(`./system/${handler}`)(client, fs);
});

app.use(express.static('public'));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});
app.listen(3000, () => {
	console.log(`Example app listening at http://localhost:3000`);
});

client.dbl.on('posted', async () => {
	console.log('Server count was posted!');
});
client.dbl.on('error', async e => {
	console.log(`An occured error! ${e}`);
});

client.on('warn', console.warn);
client.on('error', error => console.log(error));
client.on('disconnect', () =>
	console.log(
		'I just disconnected, making sure you know, I will reconnect now...'
	)
);
client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('guildCreate', async guild => {
	client.guild.set(`guild.${guild.id}`, {
		welcome: {
			type: false,
			channelID: null,
			welcomeMessage: null
		},
		goodbye: {
			type: false,
			channelID: null,
			goodbyeMessage: null
		},
		autoroles: {
			type: false,
			roleID: null
		},
		logging: {
			type: false,
			channelID: null
		},
		badword: {
			type: false,
			word: []
		}
	});
});

client.on('guildMemberAdd', async member => {
	let autoroles = client.guild.get(`guild.${member.guild.id}.autoroles.roleID`);
	let autorolesStatus = client.guild.get(
		`guild.${member.guild.id}.autoroles.type`
	);
	let welcomeStatus = client.guild.get(`guild.${member.guild.id}.welcome.type`);
	let welcomeChannel = client.guild.get(
		`guild.${member.guild.id}.welcome.channelID`
	);
	let welcomeMessage = client.guild.get(
		`guild.${member.guild.id}.welcome.welcomeMessage`
	);
	if (!welcomeChannel && welcomeChannel == null) return;
	if (!welcomeStatus && welcomeStatus == false) return;
	if ((!welcomeMessage && welcomeMessage == null) || undefined)
		welcomeMessage =
			"Welcome to {server}'s server {user} You're the {membercount} member!";
	//welcomeMessage.toLowerCase()
	welcomeMessage = welcomeMessage.replace(/{user}/gi, member.toString());
	welcomeMessage = welcomeMessage.replace(
		/{server}/gi,
		member.guild.name.toString()
	);
	welcomeMessage = welcomeMessage.replace(
		/{membercount}/gi,
		member.guild.memberCount.toString()
	);
	welcomeMessage = welcomeMessage.replace(
		/{usertag}/gi,
		member.user.tag.toString()
	);
	welcomeMessage = welcomeMessage.replace(
		/{username}/gi,
		member.user.username.toString()
	);

	if (welcomeStatus && welcomeStatus == true) {
		let channel = member.guild.channels.cache.get(welcomeChannel);
		channel.send(welcomeMessage);
	}
	if (!autorolesStatus && autorolesStatus == false) {
		return;
	} else {
		if (!autoroles) {
			return;
		} else {
			let role = member.guild.roles.cache.get(autoroles);
			member.roles.add(role.id).catch(err => console.log(err.stack));
		}
	}
});

client.on('guildMemberRemove', async member => {
	let goodbyeStatus = client.guild.get(`guild.${member.guild.id}.goodbye.type`);
	let goodbyeChannel = client.guild.get(
		`guild.${member.guild.id}.goodbye.channelID`
	);
	let goodbyeMessage = client.guild.get(
		`guild.${member.guild.id}.goodbye.goodbyeMessage`
	);
	if (!goodbyeChannel && goodbyeChannel == null) return;
	if (!goodbyeStatus && goodbyeStatus == false) return;
	if ((!goodbyeMessage && goodbyeMessage == null) || undefined)
		goodbyeMessage = 'Goodbye from {server} {user} I hope you come back!';
	//welcomeMessage.toLowerCase()
	goodbyeMessage = goodbyeMessage.replace(/{user}/gi, member.toString());
	goodbyeMessage = goodbyeMessage.replace(
		/{server}/gi,
		member.guild.name.toString()
	);
	goodbyeMessage = goodbyeMessage.replace(
		/{membercount}/gi,
		member.guild.memberCount.toString()
	);
	goodbyeMessage = goodbyeMessage.replace(
		/{usertag}/gi,
		member.user.tag.toString()
	);
	goodbyeMessage = goodbyeMessage.replace(
		/{username}/gi,
		member.user.username.toString()
	);

	if (goodbyeStatus && goodbyeStatus == true) {
		let channel = member.guild.channels.cache.get(goodbyeChannel);
		channel.send(goodbyeMessage);
	}
});

client.on('ready', async () => {
	let activities = [
		`for get an help commands`,
		`${client.guilds.cache.size.toLocaleString()} servers`,
		`${client.channels.cache.size.toLocaleString()} channels`,
		`${client.guilds.cache
			.reduce((a, b) => a + b.memberCount, 0)
			.toLocaleString()} users`
	];
	let i = 0;
	//client.guild.delete('blacklist')
	console.log('Bot ready');
	client.rbl.updateStats(
		client.guilds.cache.size,
		client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
	);
	setInterval(
		() =>
			client.user.setActivity(
				`o!help | ${activities[i++ % activities.length]}`,
				{ type: 'WATCHING' }
			),
		10000
	);
});

client.on('message', async msg => {
	if (msg.author.bot) return;
	if (msg.channel.type === 'dm') return;
	/* Variable */
	let messageArray = msg.content.split(' ');
	if (
		msg.content.startsWith(`<@!${client.user.id}>`) ||
		msg.content.startsWith(client.user)
	)
		return msg.inlineReply(
			':wave: My default prefix is `o!` type `o!help` for get commands help.'
		);
	let member = msg.mentions.members.first();
	if (member) {
		let afk = client.afk.get(`guild.${msg.guild.id}.afk.${member.id}`);

		if (afk) {
			let [timestamp, reason] = afk;
			let timeAgo = moment(timestamp).fromNow();
			return msg.reply(
				`${member} is currently afk (${timeAgo}) \nReason: \`${reason}\``
			);
		}
	}
	let afkMsg = client.afk.get(`guild.${msg.guild.id}.afk.${msg.author.id}`);
	if (afkMsg) {
		client.afk.delete(`guild.${msg.guild.id}.afk.${msg.author.id}`);
		return msg.inlineReply('Welcome back, I was removed you from afk list!');
	}
	badwordHandler.exec(client, msg, messageArray, prefix);
	if (!msg.content.startsWith(prefix)) return;
	let args = msg.content
		.slice(prefix.length)
		.trim()
		.split(/ +/);
	var searchString = messageArray.slice(1).join(' ');
	var url = messageArray[1] ? messageArray[1].replace(/<(.+)>/g, '$1') : '';
	//console.log(searchString);
	//var serverQueue = client.queue.get(msg.guild.id);
	let cmd = args.shift().toLowerCase();

	if (cmd == 'rbl') {
		let user = msg.mentions.users.first();
		if (!user) return msg.channel.send('Please mention a bot!');
		if (user.bot == false) return msg.channel.send('User must bot!');
		client.rbl.getBot(user.id).then(x => {
			if (x == null || undefined)
				return msg.channel.send(
					'This bot is not registered in **Renzyh Bots List**'
				);
			let yes = [];
			let owner = x.botAuthorID.forEach(d => {
				yes.push(client.users.cache.get(d).tag);
			});
			let stats = {
				true: 'Approved!'
			};
			let yes1 = yes.join('\n');
			msg.channel.send(`Bot Username: ${x.botName}
        Bot Owner: ${yes1}
        Bot Library: ${x.library}
        Bot Status: ${stats[x.status]}
        Bot Prefix: ${x.prefix}
        `);
		});
	}
	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (!cmd) return;
	if (!command)
		return msg
			.inlineReply('Command not found! type `o!help` for get a commands help.')
			.then(x => x.delete({ timeout: 5000 }));
	if (command.args && !args.length) {
		return;
	}
	if (command.guildOnly && msg.channel.type === 'dm') {
		return msg.reply("I can't execute that command inside DMs!");
	}
	/* End step Variable */

	/* Mew variable */

	let blacklist = client.guild.get(`blacklist.${msg.author.id}`);
	/* End new variable */

	/* Cooldowns Handler */
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	let now = Date.now();
	let timestamps = cooldowns.get(command.name);
	let cooldownAmount = (command.cooldown || 5) * 1000;

	if (timestamps.has(msg.author.id)) {
		let expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			let timeLeft = (expirationTime - now) / 1000;
			return msg.channel
				.send(
					`⏱ | Please wait, **${timeLeft.toFixed(
						1
					)}** more second(s) before reusing the \`${command.name}\` command.`
				)
				.then(c => c.delete({ timeout: 5000 }));
		}
	}

	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	/*End step Cooldown handler*/
	try {
		exports.msg = msg;
		if (!blacklist) {
			command.run(client, msg, args);
		} else {
			msg.author
				.send(
					`<:ModerationHammer:597740719570026497> | Hey, ${
						msg.author
					} you has been blacklisted from this bot beacuse violating a rules of the bot!`
				)
				.catch(err => {
					return msg.channel
						.send(
							`I thinks you disable your DMs, so i will send this message to this channel!`
						)
						.then(x => {
							x.edit(
								`<:ModerationHammer:597740719570026497> | Hey, ${
									msg.author
								} you has been blacklisted from this bot beacuse violating a rules of the bot!`
							);
						});
				});
		}
	} catch (e) {
		console.error(e);
	} finally {
		console.log(`${msg.author.tag} used ${cmd} in guild ${msg.guild.name}`);
	}
});

/* Exports */
exports.client = client;
exports.db = db;
exports.moment = moment;
exports.handleVideo = handleVideo;
exports.queue = queue;

async function handleVideo(video, message, voiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		uploaded: video.channel.title,
		authors: message.author,
		create: video.publishedAt
			.toISOString()
			.replace(/T/, ' ')
			.replace(/\..+/, ''),
		voicechan: message.member.voice.channel.name,
		durationmm: video.durationSeconds
			? video.durationSeconds
			: video.duration / 1000,
		channel: `https://www.youtube.com/channel/${video.channel.id}`,
		url: `https://www.youtube.com/watch?v=${video.id}`,
		durationh: video.duration.hours,
		durationm: video.duration.minutes,
		durations: video.duration.seconds,
		duration: video.duration
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			member: message.author,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 100,
			playing: true,
			loop: false,
			encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(
				`I could not join the voice channel: ${error}`
			);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;

		var addedembed = new MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(`🎶 Added Queue:`)
			.setThumbnail(
				`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`
			)
			.setDescription(`**[${song.title}](${song.url})**`)
			.addField(
				'<:timer:772330397622075412> Duration:',
				`${require('./util.js').timeString(song.durationmm)}`,
				true
			)
			.addField(
				'<:youtubers:529206401327955998> Uploaded by:',
				`**[${song.uploaded}](${song.channel})**`,
				true
			)
			.addField(
				'<:myaudio:772330443005231154> Voice Channel:',
				song.voicechan,
				true
			)
			.addField(
				'<:profileblue:772330368392888361> Requested By:',
				song.authors.tag,
				true
			)
			.addField('🗓 Uploaded At:', song.create, true)
			.addField('📶 Current Volume:', `${serverQueue.volume}%`, true)
			.setTimestamp()
			.setFooter(
				`📝 If bot is not playing a music, maybe the bot is restarting!`
			);

		return message.channel.send(addedembed);
	}
	return undefined;
}

exports.play = play;

async function play(guild, song, message) {
	var serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection
		.play(
			ytdl(song.url, {
				highWaterMark: 1 << 25,
				opusEncoded: true,
				bitrate: 512000,
				liveBuffer: 40000,
				encoderArgs: serverQueue.encoderArgs,
				filter: 'audioonly',
				quality: 'highestaudio'
			}),
			{
				type: song.url.includes('youtube.com') ? 'opus' : 'ogg/opus'
			}
		)
		.on('finish', reason => {
			if (reason === 'Stream is not generating quickly enough.')
				console.log('Song ended.');
			else console.log(reason);
			const shifed = serverQueue.songs.shift();
			if (serverQueue.loop) serverQueue.songs.push(shifed);
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
	try {
		var playembed = new MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(`🎶 Start Playing:`)
			.setThumbnail(
				`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`
			)
			.setDescription(`**[${song.title}](${song.url})**`)
			.addField(
				'<:timer:772330397622075412> Duration:',
				`${require('./util.js').timeString(song.durationmm)}`,
				true
			)
			.addField(
				'<:youtubers:529206401327955998> Uploaded by:',
				`**[${song.uploaded}](${song.channel})**`,
				true
			)
			.addField(
				'<:myaudio:772330443005231154> Voice Channel:',
				song.voicechan,
				true
			)
			.addField(
				'<:profileblue:772330368392888361> Requested By:',
				song.authors.tag,
				true
			)
			.addField('🗓 Uploaded At:', song.create, true)
			.addField('📶 Current Volume:', `${serverQueue.volume}%`, true)
			.setTimestamp()
			.setFooter(
				`📝 If bot is not playing a music, maybe the bot is restarting!`
			);

		if (!serverQueue.loop) {
			//serverQueue.msgVoiceEnd = await
			serverQueue.textChannel.send(playembed).catch(err => console.log(err));
		} else {
			return;
			//serverQueue.msgVoiceEnd.delete();
			//serverQueue.textChannel.send(playembed)
			//.catch(err => console.log(err));
		}
	} catch (err) {
		message.channel.send(`\`\`\`${err}\`\`\``);
	}
}
/* =========== */
client.login(token);

process.on('unhandledRejection', (reason, promise) => {
	try {
		console.error(
			'Unhandled Rejection at: ',
			promise,
			'reason: ',
			reason.stack || reason
		);
	} catch {
		console.error(reason);
	}
});

process.on('uncaughtException', err => {
	console.error(`Caught exception: ${err}`);
});
