


/**
 * @Info You will need Message Content intent to use this.
 */



const MS = require("ms");

// Helper function to handle responses
function replyWithError(message, content, bot) {
    message.channel.send({
        content: `# \`${bot.cool.EMOJIS.error}\` ${content}`,
        ephemeral: true,
    });
}

// Helper function to check for necessary roles
function hasRequiredRoles(member, requiredRoles) {
    if (requiredRoles && requiredRoles.length > 0 && member.roles.cache.size > 0) {
        return member.roles.cache.some((role) => requiredRoles.includes(role.id));
    }
    return true;
}

// Message Create Event Handler
module.exports = {
    name: "messageCreate",
    run: async (bot, message) => {
        // Ignore messages from bots or without a prefix
        if (message.author.bot || !message.content.startsWith(bot.config.PREFIX)) return;

        // Extract command and arguments
        const args = message.content.slice(bot.config.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Check if the command exists
        if (!bot.msgCmds.has(commandName)) return;
        const CMD_FILE = bot.msgCmds.get(commandName);

        // Check if the command is restricted to developers
        if (
            CMD_FILE.devOnly &&
            bot.config.DEVS.length > 0 &&
            !bot.config.DEVS.includes(message.author.id)
        ) {
            return replyWithError(
                message,
                `Only \`${bot.user.tag}\`'s developers are allowed to use this command. You are not on the list.`,
                bot
            );
        }

        // Check if the bot is in maintenance mode
        if (bot.config.MAINTENANCE_MODE) {
            return replyWithError(
                message,
                `Currently ${bot.user.tag} is under maintenance.`,
                bot
            );
        }

        // Check if the user has the necessary permissions
        if (
            CMD_FILE.permissions &&
            !message.member?.permissions.has(CMD_FILE.permissions)
        ) {
            return replyWithError(
                message,
                `You must have the following permissions to use this command: ${CMD_FILE.permissions.join(", ")}`,
                bot
            );
        }

        // Check if the user has the required roles
        if (!hasRequiredRoles(message.member, CMD_FILE.roles)) {
            return replyWithError(
                message,
                `You must have any of the following roles to use this command: ${CMD_FILE.roles.join(", ")}`,
                bot
            );
        }

        // Handle command cooldowns
        const cooldownKey = `${CMD_FILE.name}_${message.author.id}`;
        const COOLDOWN = CMD_FILE.cooldown || bot.config.DEFAULT_COOLDOWN;

        if (!bot.cooldown.has(cooldownKey)) {
            // Set cooldown if the user isn't in cooldown mode
            bot.cooldown.set(cooldownKey, Date.now());
            setTimeout(() => bot.cooldown.delete(cooldownKey), COOLDOWN);
        } else {
            const expiry = bot.cooldown.get(cooldownKey) + COOLDOWN;
            if (Date.now() < expiry) {
                const remainingTime = MS(expiry - Date.now());
                return replyWithError(
                    message,
                    `You are in Cooldown mode! Wait for \`${remainingTime}\` to use this command again.`,
                    bot
                );
            }
        }

        // Execute the command
        try {
            await CMD_FILE.run(bot, message, args);
        } catch (error) {
            console.error(`Error executing command: ${commandName}`, error);
            replyWithError(
                message,
                `An error occurred while executing the command. Please try again later.`,
                bot
            );
        }
    },
};
