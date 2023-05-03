const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection, getVoiceConnections, joinVoiceChannel } = require("@discordjs/voice");
const { Player } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addStringOption((option) =>
            option.setName("play")
            .setDescription("Search string for song")
            .setRequired(true),
        ),
    async execute(interaction) {
        const player = new Player(interaction.client);

        const voiceConnection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const channel = interaction.member.voice.channel;

        if (!channel) return interaction.reply("You have to be connected to a voice channel");
        const query = interaction.options.getString("play", true);

        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                }
            });

            return interaction.followUp(`**${track.title}** enqueued!`);
        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    },
};