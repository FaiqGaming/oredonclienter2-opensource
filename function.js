
class OredonFunction extends Error {
  constructor(message) {
    super(message);
    this.name = "OredonFunction";
  }
}

module.exports = {
  OredonFunctions: "Oredon Function | Version",
  OredonFunctionVersion: "v0.0.1-alpha",

  chunk: function(array, chunkSize) {
    let temp = [];
    for (let i = 0; i < array.length; i+=chunkSize) {
      temp.push(array.slice(i, i+chunkSize))
    }
    return temp;
  },

  formatDate: function(date) {
    return new Intl.DateTimeFormat('en-US').format(date)
  },

  blacklistUser: async function(id) {
    let { msg } = require('./server')
    let getBlacklistUser = msg.guild.members.cache.get(id)
    if (!getBlacklistUser) throw new OredonFunction("Please enter a valid blacklist user id to blacklist.")
    if (id == "297130271864520705") throw new OredonFunction("I can't do this execute to my owner!")
    let blacklist = this.getData(`blacklist.${getBlacklistUser.id}`)
    if (blacklist) throw new OredonFunction("I can't blacklist this user, beacuse he is already blacklisted!")
    let berhasilBlacklist = this.setData(`blacklist.${getBlacklistUser.id}`, true)
    return berhasilBlacklist;
  },

  unblacklistUser: async function(id) {
    let { msg } = require('./server')
    let getBlacklistUser = msg.guild.members.cache.get(id)
    if (!getBlacklistUser) throw new OredonFunction("Please enter a valid blacklist user id to remove from blacklist.")
    if (id == "297130271864520705") throw new OredonFunction("I can't do this execute to my owner!")
    let blacklist = this.getData(`blacklist.${getBlacklistUser.id}`)
    if (!blacklist || blacklist == null) throw new OredonFunction("I can't blacklist this user, beacuse he is already blacklisted!")
    let berhasilunBlacklist = this.deleteData(`blacklist.${getBlacklistUser.id}`)
    return berhasilunBlacklist;
  },

  format: function(date) {
    const { moment } = require('./server.js');
    return moment(date);
  },

  trimArray: function(arr, maxLen = 10) {
    if (arr.length > maxLen) {
      let len = arr.length - maxLen;
      arr.slice(0, maxLen)
      arr.push(`${len} more...`)
    }
    return arr;
  },

  allData: function() {
    const { db } = require('./server.js');
    let allBerhasil = db.all()
    return allBerhasil;
  },

  fetchAllData: async function() {
    const { db } = require('./server.js');
    let fetchAllBerhasil = await db.fetchAll()
    return fetchAllBerhasil;
  },

  hasData: function(value) {
    const { db } = require('./server.js');
    let hasBerhasil = db.has(value)
    return hasBerhasil;
  },

  getData: function(value) {
    const { db } = require('./server.js');
    let getBerhasil = db.get(value)
    return getBerhasil;
  },

  fetchData: async function(value) {
    const { db } = require('./server.js');
    let getBerhasil = await db.fetch(value)
    return getBerhasil;
  },

  addData: function(value, setValue) {
    const { db } = require('./server.js');
    let addBerhasil = db.add(value, setValue)
    return addBerhasil;
  },

  subtractData: function(value, setValue) {
    const { db } = require('./server.js');
    let subtractBerhasil = db.subtract(value, setValue)
    return subractBerhasil;
  },

  setData: function(value, setValue) {
    const { db } = require('./server.js');
    let setBerhasil = db.set(value, setValue)
    return setBerhasil;
  },

  pushData: function(value, setValue) {
    const { db } = require('./server.js');
    let pushBerhasil = db.push(value, setValue)
    return pushBerhasil;
  },

  deleteData: function(value) {
    const { db } = require('./server.js');
    let deleteBerhasil = db.delete(value)
    return deleteBerhasil;
  },

  fetchUser: async function(id) {
    let { client } = require('./server')
    let fetchUser = await client.users.fetch(id)
    if (!fetchUser) throw new OredonFunction("Please enter a valid user id to fetch.")
    
    return getMember;
  },

  getUser: function(userID) {
    let { client } = require('./server')
    let getMember = client.users.cache.get(userID)

    if (!getMember) throw new OredonFunction("Please enter a valid user id value.")
    
    return getMember;
  },

  getAvatar: function(id) {
    let { client } = require('./server')
    let member = clinet.users.cache.get(id)
    if (!member) throw new OredonFunction("Please enter a valid user id value.")
    return member.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 });
  },

  getMember: function(id) {
    let { msg } = require('./server')
    let member = msg.mentions.members.first()
    if (!member) member = msg.author
    return member;
  },

  getChannel: function(channelID) {
    let { client } = require('./server')
    let getChannels = clinet.channels.cache.get(channelID)
    if (!getChannels) throw new OredonFunction("Please enter a valid channel id value.")
    
    return getChannels;
  },

  getRole: function(roleID) {
    let { msg } = require('./server')
    let getRoles = msg.guild.roles.cache.get(roleID)
    if (!getRoles) throw new OredonFunction("Please enter a valid role id value.")
    
    return getRoles;
  },

  getEmoji: function(emojiID) {
    let { client } = require('./server')
    let getEmojis = client.emojis.cache.get(emojiID)
    if (!getEmojis) throw new OredonFunction("Please enter a valid emoji id value.")
    
    return getEmojis;
  }
}