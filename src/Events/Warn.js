// Running our Warn event.
module.exports = {
  name: "warn",
  once: true,
  run: async (bot, error) => {
    bot.logger.warn(String(error.stack));
  },
};
