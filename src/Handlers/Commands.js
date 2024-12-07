const { SlashCommandBuilder } = require("discord.js");
const FS = require("fs");
const PATH = require("path");
const {
    handleLocalizations,
    optionBuilder,
    subcmdBuilder,
    subcmdGroupBuilder,
} = require("../Utils/Functions");
const AsciiTable = require("ascii-table");

const table = new AsciiTable()
    .setHeading("Commands", "Type", "Status")
    .setBorder("│", "─", "■", "■");

module.exports = (bot) => {
    // Arrays for interaction and message commands
    const interactionCmds = [];
    const messageCmds = [];
    bot.slashCmds.clear();
    bot.msgCmds.clear();
    var total_cmds = 0;

    // Function to load commands from a sub-directory
    function loadCommandsFromSubDir(dir, isInteraction) {
        FS.readdirSync(dir).forEach((subDir) => {
            if (FS.lstatSync(`${dir}/${subDir}`).isDirectory()) {
                const commandFiles = FS.readdirSync(`${dir}/${subDir}`).filter((file) =>
                    file.endsWith(".js")
                );

                for (const file of commandFiles) {
                    const command = require(PATH.join(process.cwd(), dir, subDir, file));
                    if (command.name) {
                        const COMMAND = isInteraction
                            ? new SlashCommandBuilder()
                                .setName(String(command.name).toLowerCase())
                                .setDescription(
                                    command.description ? command.description : "No description added."
                                )
                            : command;

                        // Handle localization
                        if (command.localizations) handleLocalizations(COMMAND, command.localizations);

                        // Handle command type for interactions
                        if (isInteraction && command.type) {
                            let CmdType = 1;
                            if (
                                String(command.type).toLowerCase() === "chatinput" ||
                                command.type === 1
                            ) {
                                CmdType = 1;
                            } else if (
                                String(command.type).toLowerCase() === "user" ||
                                command.type === 2
                            ) {
                                CmdType = 2;
                            } else if (
                                String(command.type).toLowerCase() === "message" ||
                                command.type === 3
                            ) {
                                CmdType = 3;
                            }
                            Object.assign(COMMAND, {
                                type: CmdType,
                            });
                        }

                        // Add options for interaction commands
                        if (isInteraction) {
                            if (command.subGroupOptions) {
                                subcmdGroupBuilder(COMMAND, command.subGroupOptions);
                            } else if (command.subOptions) {
                                subcmdBuilder(COMMAND, command.subOptions);
                            } else if (command.options?.length) {
                                optionBuilder(COMMAND, command.options);
                            }
                        }

                        if (command.nsfw) {
                            COMMAND.setNSFW(command.nsfw);
                        }

                        if (isInteraction) { bot.slashCmds.set(command.name, command) } else { bot.msgCmds.set(command.name, command) }
                        if (isInteraction) {
                            interactionCmds.push(COMMAND.toJSON());
                        } else {
                            messageCmds.push(COMMAND);
                        }
                        total_cmds++;
                        table.addRow(file.split(".js")[0], `${isInteraction ? " Interaction" : " Message"}`, "  ☑");
                    } else {
                        table.addRow(file.split(".js")[0], `${isInteraction ? " Interaction" : " Message"}`, "  🔴");
                    }
                }
            }
        });
    }

    // Function to load commands from a directory
    function loadCommandsFromDir(dir, isInteraction) {
        if (FS.lstatSync(dir).isDirectory()) {
            const commandFiles = FS.readdirSync(dir).filter((file) =>
                file.endsWith(".js")
            );

            for (const file of commandFiles) {
                const command = require(PATH.join(process.cwd(), dir, file));
                if (command.name) {
                    const COMMAND = isInteraction
                        ? new SlashCommandBuilder()
                            .setName(String(command.name).toLowerCase())
                            .setDescription(
                                command.description ? command.description : "No description added."
                            )
                        : command;

                    // Handle localization
                    if (command.localizations) handleLocalizations(COMMAND, command.localizations);

                    // Handle command type for interactions
                    if (isInteraction && command.type) {
                        let CmdType = 1;
                        if (
                            String(command.type).toLowerCase() === "chatinput" ||
                            command.type === 1
                        ) {
                            CmdType = 1;
                        } else if (
                            String(command.type).toLowerCase() === "user" ||
                            command.type === 2
                        ) {
                            CmdType = 2;
                        } else if (
                            String(command.type).toLowerCase() === "message" ||
                            command.type === 3
                        ) {
                            CmdType = 3;
                        }
                        Object.assign(COMMAND, {
                            type: CmdType,
                        });
                    }

                    // Add options for interaction commands
                    if (isInteraction) {
                        if (command.subGroupOptions) {
                            subcmdGroupBuilder(COMMAND, command.subGroupOptions);
                        } else if (command.subOptions) {
                            subcmdBuilder(COMMAND, command.subOptions);
                        } else if (command.options?.length) {
                            optionBuilder(COMMAND, command.options);
                        }
                    }

                    if (command.nsfw) {
                        COMMAND.setNSFW(command.nsfw);
                    }

                    if (isInteraction) { bot.slashCmds.set(command.name, command) } else { bot.msgCmds.set(command.name, command) }
                    if (isInteraction) {
                        interactionCmds.push(COMMAND.toJSON());
                    } else {
                        messageCmds.push(COMMAND);
                    }
                    total_cmds++;
                    table.addRow(file.split(".js")[0], `${isInteraction ? " Interaction" : " Message"}`, "  ☑");
                } else {
                    table.addRow(file.split(".js")[0], `${isInteraction ? " Interaction" : " Message"}`, "  🔴");
                }
            }
        }
    }

    // Load Interaction commands
    loadCommandsFromDir("src/InteractionCmds", true);
    loadCommandsFromSubDir("src/InteractionCmds", true);

    // Load Message commands
    loadCommandsFromDir("src/MessageCmds", false);
    loadCommandsFromSubDir("src/MessageCmds", false);

    // Display the commands loading status
    bot.logger.info(`Checked ${total_cmds} Command files Successfully.`);
    console.log(String(table));

    // Deploy commands
    bot.on("ready", async (bot) => {
        try {
            if (bot.config.GLOBAL === true && bot.config.DEVMODE === true) {
                return bot.logger.error(
                    `You can't deploy commands in test guild only while the Global is enabled, please consider using either or none of it.`
                );
            }

            if (bot.config.GLOBAL === false && bot.config.DEVMODE === true) {
                if (!bot.config.DEVGUILD)
                    return bot.logger.error(
                        `Test guild's ID is either not provided or is Invalid in ".env" file.`
                    );

                try {
                    bot.guilds.cache
                        .get(bot.config.DEVGUILD)
                        .commands.set(interactionCmds)
                        .then(
                            bot.logger.success(
                                `Successfully deployed ${total_cmds} Commands in Test Guild Only.`
                            )
                        )
                        .catch((e) => console.log(e));
                } catch (e) {
                    console.log(String(e).grey);
                }
            }

            if (bot.config.GLOBAL === true && bot.config.DEVMODE === false) {
                try {
                    bot.application.commands.set(interactionCmds).catch((e) =>
                        console.log(e)
                    );

                    bot.logger.info(
                        `Successfully deployed ${total_cmds} Commands globally.`
                    );
                    return bot.logger.info(
                        `It might take an hour or more to deploy commands globally.`
                    );
                } catch (e) {
                    bot.logger.error(e);
                }
            }

            if (bot.config.GLOBAL === false && bot.config.DEVMODE === false) {
                bot.guilds.cache
                    .map((guild) => guild)
                    .forEach((guild) => {
                        try {
                            guild.commands
                                .set(interactionCmds)
                                .then(
                                    bot.logger.info(
                                        `Successfully deployed ${total_cmds} Commands at : ${guild.name}`
                                    )
                                )
                                .catch((e) => console.log(e));
                        } catch (e) {
                            console.log(String(e).grey);
                        }
                    });
                return;
            }
        } catch (e) {
            bot.logger.error(e);
        }
    });

    // Deploy commands when a new guild is added
    bot.on("guildCreate", (guild) => {
        try {
            if (bot.config.GLOBAL === false) {
                try {
                    guild.commands
                        .set(interactionCmds)
                        .then(
                            bot.logger.info(
                                `Successfully deployed ${total_cmds} Commands at : ${guild.name}`
                            )
                        )
                        .catch((e) => console.log(e));
                } catch (e) {
                    console.log(String(e).grey);
                }
            }
        } catch (e) {
            bot.logger.error(e);
        }
    });
};
