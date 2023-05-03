const { SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");
var _ = require('lodash');
const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Queues music based of a spotify playlist")
        .addStringOption((option) =>
            option.setName("playlist")
            .setDescription("Link to spotify playlist")
            .setRequired(true),
        ),
    async execute(interaction) {
        const player = new Player(interaction.client);

        const query = interaction.options.getString("playlist");

        var tracks = await getTracks(query);
        tracks = _.shuffle(tracks)

        const channel = interaction.member.voice.channel;

        await interaction.deferReply();
        
  
        for (let i = 0; i < tracks.length; i++) {
            const playlistQuery = `${tracks[i].name} ${tracks[i].artist}`

            await player.play(channel, playlistQuery, {
                nodeOptions: {
                    metadata: interaction,
                }
            });
        }

        return interaction.followUp(`**${tracks.length}** Songs from the playlist has been added to the queue.`);
    },
};