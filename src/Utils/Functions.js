module.exports = {
    currentDateTime,
    set2string,
    formatMS,
    formatTime,
    replyWithError,
    handleLocalizations,
    optionBuilder,
    subcmdBuilder,
    subcmdGroupBuilder,
};

/**
 * Get the current Process-Time formatted
 * @param {number} timestamp Time in ms
 * @returns {string} Time Formatted as: "ddd DD-MM-YYYY HH:mm:ss.SSSS"
 */
function currentDateTime(timestamp = Date.now()) {
    const date = new Date(timestamp);
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const DD = set2string(date.getDate());
    const MM = set2string(date.getMonth() + 1);
    const YYYY = date.getFullYear();
    const HH = set2string(date.getHours());
    const mm = set2string(date.getMinutes());
    const ss = set2string(date.getSeconds());
    const SSSS = formatMS(date.getMilliseconds());
    const ddd = days[date.getDay()];
    return `${ddd} ${DD}-${MM}-${YYYY} ${HH}:${mm}:${ss}.${SSSS}`;
}

/**
 * Format a Second/Minute/Hour Timespan to double Digits
 * @param {number} n If not provided "00" will be returned
 * @returns {string} Returns string of number less than 10 formatted to 2 digits
 */
function set2string(n = 0) {
    return n.toString().padStart(2, "0");
}

/**
 * Format a Millisecond Timespan to triple Digits
 * @param {number} n If not provided "000" will be returned
 * @returns {string} Formatted Milliseconds in a length of 3
 */
function formatMS(n = 0) {
    return n.toString().padStart(3, "0");
}

/**
 * Helper function to format the remaining time of a task
 * @param {number} ms Time to format
 * @returns {string} Formatted Milliseconds to human-readable
 */
function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return [
        hours ? `${hours}h` : "",
        minutes ? `${minutes}m` : "",
        `${seconds}s`,
    ]
        .filter(Boolean)
        .join(" ");
}

/**
 * Helper function to handle responses
 * @param {object} interaction 
 * @param {string} message
 * @param {object} bot
 * @returns {string}
 */
function replyWithError(interaction, message, bot) {
    interaction.reply({
        content: `### \`${bot.cool.EMOJIS.error}\` ${message}`,
        ephemeral: true,
    });
}

/**
 * Handle Localizations
 * @param {object} COMMAND
 * @param {array} localizations 
 */
function handleLocalizations(COMMAND, localizations) {
    try {
        if (localizations) {
            for (const localization of localizations) {
                if (localization.lang) {
                    if (localization.name) {
                        COMMAND.setNameLocalization(
                            localization.lang,
                            String(localization.name).toLowerCase()
                        );
                    }
                    if (localization.description) {
                        COMMAND.setDescriptionLocalization(
                            localization.lang,
                            localization.description
                        );
                    }
                }
            }
        }
    } catch (e) {
        bot.logger.error(e);
    }
}

/**
 * Options builder
 * @param {object} Command The command for which options are being set
 * @param {array} Options The options for the command
 * @returns {object} Command object containing the options to deploy
 */
function optionBuilder(Command, Options) {
    Options.forEach((option) => {
        const method = getOptionType(option.type);
        if (method) {
            Command[method]((builder) => setupOption(builder, option));
        }
    });
}

/**
 * Sub-command builder
 * @param {object} Command The command for which subcommands are being set
 * @param {array} Options The options data
 * @returns {object} Command object containing the subcommands
 */
function subcmdBuilder(Command, Options) {
    Options.forEach((option) => {
        Command.addSubcommand((subCmd) => {
            setupOption(subCmd, option);
            if (option.options) optionBuilder(subCmd, option.options);
            return subCmd;
        });

    });
}

/**
 * Sub-command-group builder
 * @param {object} Command The command for which subcommand groups are being set
 * @param {array} Options The options data
 * @returns {object} Command object containing the subcommand groups
 */
function subcmdGroupBuilder(Command, Options) {
    Options.forEach((option) => {
        Command.addSubcommandGroup((subCmdGroup) => {
            setupOption(subCmdGroup, option);
            if (option.options) subcmdBuilder(subCmdGroup, option.options);
            return subCmdGroup;
        });

    });
}

/**
 * Set up the properties for an option
 * @param {object} builder The option builder
 * @param {object} option The option data
 * @returns {object} The option object
 */
function setupOption(builder, option) {
    builder
        .setName(option.name.toLowerCase())
        .setDescription(option.description || "No description provided.")
    // .setRequired(option.required || false);

    if (option.localizations) handleLocalizations(builder, option.localizations);
    if (option.required) builder.setRequired(option.required);
    if (option.choices) builder.addChoices(...option.choices);
    if (option.channelTypes) builder.addChannelTypes(...option.channelTypes);
    if (option.min) builder.setMinValue(option.min);
    if (option.max) builder.setMaxValue(option.max);
    if (option.autocomplete !== undefined) builder.setAutocomplete(option.autocomplete);

    return builder;
}

/**
 * Determine the correct option method based on type
 * @param {string|number} type The option type
 * @returns {string|null} The method to use for the option type
 */
function getOptionType(type) {
    const typeMap = {
        string: "addStringOption",
        integer: "addIntegerOption",
        boolean: "addBooleanOption",
        user: "addUserOption",
        channel: "addChannelOption",
        role: "addRoleOption",
        mentionable: "addMentionableOption",
        number: "addNumberOption",
        attachment: "addAttachmentOption",
        1: "addSubcommand",
        2: "addSubcommandGroup",
        3: "addStringOption",
        4: "addIntegerOption",
        5: "addBooleanOption",
        6: "addUserOption",
        7: "addChannelOption",
        8: "addRoleOption",
        9: "addMentionableOption",
        10: "addNumberOption",
        11: "addAttachmentOption",
    };
    return typeMap[String(type).toLowerCase()] || null;
}
