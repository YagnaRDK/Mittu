// const MS = require("ms");
const { formatTime, replyWithError } = require("../Utils/Functions");

// Improved Interaction Handler
module.exports = {
  name: "interactionCreate",
  run: async (bot, interaction) => {
    // Ensure the interaction is a command and exists in the commands collection
    if (!interaction.isCommand() || !bot.slashCmds.has(interaction.commandName)) {
      return;
    }

    const CMD_FILE = bot.slashCmds.get(interaction.commandName);

    // Check if the command is restricted to developers
    if (
      CMD_FILE.devOnly &&
      bot.cool.DEVS.length > 0 &&
      !bot.cool.DEVS.includes(interaction.user.id)
    ) {
      return replyWithError(
        interaction,
        `Only \`${bot.user.tag}\`'s developers are allowed to use this command. And sadly you are not on the list 😶`,
        bot
      );
    }

    // Check if the bot is in maintenance mode
    if (bot.config.MAINTENANCE_MODE) {
      return replyWithError(
        interaction,
        `Currently ${bot.user.tag} is under maintenance. Will be back soon, promise! 🙂`,
        bot
      );
    }

    // Check if the user has the necessary permissions
    if (
      CMD_FILE.permissions &&
      !interaction.member?.permissions.has(CMD_FILE.permissions)
    ) {
      return replyWithError(
        interaction,
        `You must have the following permissions to use this command: ${CMD_FILE.permissions.join(", ")}`,
        bot
      );
    }

    // Check if the user has the required roles
    if (
      CMD_FILE.roles &&
      CMD_FILE.roles.length > 0 &&
      interaction.member.roles.cache.size > 0 &&
      !interaction.member.roles.cache.some((role) =>
        CMD_FILE.roles.includes(role.id)
      )
    ) {
      return replyWithError(
        interaction,
        `You must have any of the following roles to use this command: ${CMD_FILE.roles.join(", ")}`,
        bot
      );
    }

    // Handle command cooldowns
    const cooldownKey = `${CMD_FILE.name}_${interaction.user.id}`;
    const COOLDOWN = CMD_FILE.cooldown || bot.config.DEFAULT_COOLDOWN;

    // Checks and implements the cooldown system
    const now = Date.now();
    const userCooldown = bot.cooldown.get(cooldownKey);

    if (userCooldown && now < userCooldown) {
      const remainingTime = userCooldown - now;
      return replyWithError(
        interaction,
        `⏳ You are on cooldown! Please wait \`${formatTime(remainingTime)}\` to use this command again.`,
        bot
      );
    }
    // If no cooldown is active, set the new cooldown expiry time
    bot.cooldown.set(cooldownKey, now + COOLDOWN);
    // Automatically clear the cooldown after the time has elapsed
    setTimeout(() => bot.cooldown.delete(cooldownKey), COOLDOWN);


    // Execute the command
    await CMD_FILE.run(bot, interaction);

    // Handle Buttons
    if (interaction.isButton()) {
      // Additional button handling logic goes here
    }

    // Handle Select Menus
    if (interaction.isStringSelectMenu()) {
      // Additional select menu handling logic goes here
    }

    // Handle Context Menus
    if (interaction.isUserContextMenuCommand()) {
      await interaction.deferReply({ ephemeral: false });
      const CMD = bot.slashCmds.get(interaction.commandName);
      if (CMD) {
        await CMD.run(bot, interaction);
      }
    }
  },
};
