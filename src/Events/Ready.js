// Running our Ready event.
module.exports = {
  name: "ready",
  once: true,
  run: async (bot) => {
    bot.logger.info(`Trying to log in as ${bot.user.tag}.`);
    bot.logger.success(`Logged into the ${bot.user.tag} successfully.`);
  },
};
