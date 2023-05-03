const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection, getVoiceConnections, joinVoiceChannel, VoiceConnection } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops the musicplayer."),
    async execute(interaction) {
        const voiceConnection = getVoiceConnection(interaction.guildId);
        voiceConnection.destroy();
        return interaction.reply("DJSerb destroyed!");
    },
};