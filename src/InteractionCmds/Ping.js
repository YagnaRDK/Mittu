module.exports = {
    name: "ping",
    description: "shows the ping of the bot.",
    localizations: [
        {
            lang: "es-ES",
            name: "ping",
            description: "muestra el ping del bot.",
        },
        {
            lang: "fr",
            name: "ping",
            description: "affiche le ping du bot.",
        },
        {
            lang: "de",
            name: "ping",
            description: "zeigt den Ping des Bots an.",
        }
    ],
    cooldown: 10000,

    run: async (bot, interaction) => {
        await interaction.reply({
            content: `🏓 Pong \`${bot.ws.ping}ms\``,
        });
    },
};
