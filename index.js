const keep_alive = require('./keep_alive.js')
const Discord = require('discord.js'),
    DisTube = require('distube'),
    client = new Discord.Client(),
    config = {
        prefix: "t!",
        token: process.env.DISCORD_BOT_SECRET,
        token2: process.env.DISCORD_BOT_SECRET2
    };
const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });

const fs = require('fs');

client.on('ready', () => {
    client.user.setPresence({
    status: 'online',
    activity: {
        name: 't!help',
        type: 'LISTENING',
    }
    }) 
  console.log("Ready");
  console.log("- " + client.user.username);
});

const helpEmbed = {

  "title": "All Commands",
  "description": "Use t!<command>",
  "color": 53380,
  "fields": [
    {
      "name": "play <url>",
      "value": "Plays the audio from that url/site",
      "inline": true
    },
    {
      "name": "skip",
      "value": "Skips the currently playing song",
      "inline": true
    },
    {
      "name": "loop <single, all, off>",
      "value": "Changes the loop mode",
      "inline": true
    },
    {
      "name": "stop",
      "value": "Stops all audio & leaves the voice channel",
      "inline": true
    },
    {
      "name": "queue",
      "value": "Shows the queue",
      "inline": true
    },
    {
      "name": "help",
      "value": "Shows this",
      "inline": true
    },
  ]
};


client.on('message', async message => {
   if (message.mentions.has(client.user)) { 
    message.channel.send({ embed: helpEmbed }).catch(err => console.log(err));
   }

  if (!message.content.startsWith(config.prefix)) return;
  if (message.author.bot) return;
  // Disabled | console.log("Debug Log: " + message.content);
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift();

    if (["p", "play"].includes(command)){
        distube.play(message, args.join(" ")).catch(err => console.log(err));
        message.channel.send(`:arrow_forward: Added To Queue!`).catch(err => console.log(err));
}
    if (["repeat", "loop"].includes(command)){
        if (args == "single"){
          distube.setRepeatMode(message, "1");
          message.channel.send(`:repeat_one: Repeat Mode: Single`).catch(err => console.log(err));
        } else if (args == "all"){
          distube.setRepeatMode(message, "2");
          message.channel.send(`:repeat: Repeat Mode: All`).catch(err => console.log(err));
        } else if (args == "off") {
          distube.setRepeatMode(message, "0");
          message.channel.send(`Repeat Mode: Off`).catch(err => console.log(err));
        } else {
          message.channel.send(`Unknown Mode! Valid Modes: single, all, off`).catch(err => console.log(err));
        }
    }
    if (command == "stop") {
        distube.stop(message);
        message.channel.send(":stop_button: Stopped the music!").catch(err => console.log(err));
        if(message.guild.connection) message.guild.voiceConnection.disconnect();
    }

    if (command == "skip"){
        distube.skip(message);
        message.channel.send(":fast_forward: Skipped!").catch(err => console.log(err));
    }
    if (command == "queue") {
        let queue = distube.getQueue(message);
        message.channel.send('Current queue: :arrow_heading_down:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n")).catch(err => console.log(err));
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send(":control_knobs: Current queue filter: " + (filter || "Off")).catch(err => console.log(err));
    }

  if (command === "help") {
    message.channel.send(`:e_mail: Commands Sent To Your DMs`).catch(err => console.log(err));
    message.author.send({ embed: helpEmbed }).catch(err => console.log(err));
	}
  
});

client.login(config.token);