const {Client,Collection} = require('discord.js');

class OredonClient extends Client {
	constructor(ops) {
		super(ops);
    const fetch = require('node-superfetch');
    const translate = require('@k3rn31p4nic/google-translate-api');
    const db = require('quick.db');
    const moment = require('moment');
    const { dbltoken } = require("../config.json")
    var queue = new Map();
    const DBL = require('dblapi.js');
    this.dbl = new DBL(dbltoken, this)
    const RBL = require('renzyhapi.js');
    const rbl = new RBL('720935692485787689', '5d37qv1ixdjicudt42udqs');
    this.snek = fetch;
    this.rbl = rbl;
    this.queue = queue;
    this.func = require('../function')
    this.pings = new Array(96).fill(0);
    this.util = require('../util')
    this.db = new db.table('database');
    this.guild = new db.table('guilddatabase');
    this.afk = new db.table('AFKDatabase');
    this.commands = new Collection();
    this.aliases = new Collection();
    this.cooldown = new Collection();
    this.calculator = function(whatImust, plus, plus1) {
        if (whatImust == "tambah") {
          if (!plus || !plus1) return console.error('Error you didn\'t input any calc to + it!')
          return plus + plus1
        } else if (whatImust == "kurang") {
            if (!plus || !plus1) return console.error('Error you didn\'t input any calc to - it!')
            return plus - plus1
        } else if (whatImust == "kali") {
            if (!plus || !plus1) return console.error('Error you didn\'t input any calc to * it!')
            return plus * plus1
        } else if (whatImust == "pangkat") {
            if (!plus || !plus1) return console.error('Error you didn\'t input any calc to ** it!')
            return plus ** plus1
        } else if (whatImust == "bagi") {
            if (!plus || !plus1) return console.error('Error you didn\'t input any calc to / it!')
            return plus / plus1
        } else {
            return "Wrong calculate!"
        }
    }
    this.translate = async (text, message) => {
      let lang = (await this.guild.has(`guild.${message.guild.id}.language`))
        ? await this.guild.get(`guild.${message.guild.id}.language`)
        : 'en';
      let translated = await translate(text, { from: 'en', to: lang });
      return translated.text;
    };
	}
	updateStats() {
		const { heapTotal, heapUsed } = process.memoryUsage();
		const { loadavg } = require('os');
		this.health.cpu.shift();
		this.health.cpu.push(((loadavg()[0] * 10000) | 0) / 100);

		this.health.prc.shift();
		this.health.prc.push(((100 * (heapTotal / 1048576)) | 0) / 100);

		this.health.ram.shift();
		this.health.ram.push(((100 * (heapUsed / 1048576)) | 0) / 100);

		this.health.cmd.shift();
		this.health.cmd.push(0);
	}
}

module.exports = OredonClient;