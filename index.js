const dotenv = require("dotenv");
const path = require("path");
const { SlashCreator, GatewayServer } = require("slash-create");
const { Client } = require("discord.js");
const { Player } = require("discord-player");
const { registerPlayerEvents } = require("./events");
const { generateDocs } = require("./docs");

dotenv.config();

const client = new Client({
  intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES"],
});

client.player = new Player(client);
registerPlayerEvents(client.player);

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_CLIENT_ID,
  token: process.env.DISCORD_CLIENT_TOKEN,
});

client.on("ready", () => {
  client.user.setActivity("some tunes | tunez.ml", {
    type: "LISTENING",
  });
  setInterval(() => {
    client.user.setActivity("some tunes | tunez.ml", {
      type: "LISTENING",
    });
  }, 3600000);

  console.log(`Logging in as ${client.user.tag}`);

  console.log("Updating Commands.md...");
  generateDocs(creator.commands);
  console.log("Ready!");
});

creator
  .withServer(
    new GatewayServer((handler) => client.ws.on("INTERACTION_CREATE", handler))
  )
  .registerCommandsIn(path.join(__dirname, "commands"));

if (process.env.DISCORD_GUILD_ID)
  creator.syncCommandsIn(process.env.DISCORD_GUILD_ID);
else creator.syncCommands();

client.login(process.env.DISCORD_CLIENT_TOKEN);
module.exports = {
  client,
  creator,
};