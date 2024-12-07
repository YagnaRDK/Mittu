module.exports = {
    name: "test",
    description: "Testing command.",
    cooldown: 60,

    run: async (bot, message, args) => {
        await message.channel.send({
            content: `🏓 Testing, hehehe \`${bot.ws.ping}ms\``,
        });
    },
};
