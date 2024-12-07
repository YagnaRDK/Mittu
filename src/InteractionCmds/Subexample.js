const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "subcmd", // name of the command
    description: "here is a subcmd.", // description of the command
    type: 1, // type of the command, CHAT_INPUT (1) [upcoming: USER(2), MESSAGE(3)]
    devOnly: false, // if you want only developers' of the bot to use the command setup list of devlopers at `src/Configs/Cool.json`
    subOptions: [
        {
            name: "suboption1", // name of the sub-comamnd
            description: "here is sub option 1.", // description of the sub-command
            localizations: [
                {
                    lang: "es-ES",
                    name: "subopción1",
                    description: "aquí está el ejemplo del subcomando 1.",
                },
                {
                    lang: "fr",
                    name: "sousoption1",
                    description: "voici l'exemple du sous-commande 1.",
                },
                {
                    lang: "de",
                    name: "unteroption1",
                    description: "hier ist das Unterbefehl-Beispiel 1.",
                }

            ]
        },
        {
            name: "suboption2", // name of the sub-comamnd
            description: "here is sub option 2.", // description of the sub-command
            localizations: [
                {
                    lang: "es-ES",
                    name: "subopción2",
                    description: "aquí está el ejemplo del subcomando 2.",
                },
                {
                    lang: "fr",
                    name: "sousoption2",
                    description: "voici l'exemple du sous-commande 2.",
                },
                {
                    lang: "de",
                    name: "unteroption2",
                    description: "hier ist das Unterbefehl-Beispiel 2.",
                }

            ]
        },
    ],
    cooldown: 10000, // cooldown in ms

    run: async (bot, interaction) => {
        replyEmbed = new EmbedBuilder({
            title: "Subcommand example",
            description: "This is a subcommand example. Feel free to edit and play with other commands and be a part of the fun!",
            color: bot.cool.COLOR,
            footer: {
                text: bot.cool.FOOTER_TEXT,
                iconURL: bot.cool.FOOTER_ICON,
            },
            thumbnail: {
                url: bot.cool.THUMBNAIL,
            },
            timestamp: new Date(),
        })
        interaction.reply({ embeds: [replyEmbed] })
    },
};