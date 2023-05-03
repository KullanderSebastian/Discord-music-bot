const { SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song."),
    async execute(interaction) {
        try {
            const player = new Player(interaction.client);

            const queue = player.nodes.get(interaction.guildId);

            if (!queue || !queue.isPlaying()) {
                return interaction.reply("There is no song playing right now.");
            }

            queue.node.skip()
            return interaction.reply(`Skipped **${queue.currentTrack}**`);
        } catch(e) {
            console.log(e);
        }
    },
};