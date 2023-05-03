const fs = require("node:fs");
const path = require("node:path");
require('dotenv').config()
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");

const client = new Client({ intents: ["GuildVoiceStates", GatewayIntentBits.Guilds] });
const player = new Player(client);

player.extractors.loadDefault();

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.CLIENT_TOKEN);

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".cjs"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found,`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
        if (interaction.replied || interaction.deffered) {
            await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
        } else {
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true});
        }
    }
});

player.events.on("playerStart", (queue, track) => {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
});