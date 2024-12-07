// Running our Error event.
module.exports = {
  name: "error",
  once: true,
  run: async (bot, error) => {
    bot.logger.error(error);
  },
};
