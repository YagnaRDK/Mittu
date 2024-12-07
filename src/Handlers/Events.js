const FS = require("fs");
const PATH = require("path");

var AsciiTable = require("ascii-table");
var table = new AsciiTable();
table.setHeading("Events", "Status").setBorder("│", "─", "■", "■");

module.exports = async (bot) => {
    // Loading the Events file path and total files in it.
    let TOTAL_FILES = 0;
    const EVENTS_PATH = PATH.join(__dirname, "../Events");
    const EVENTS_FILES = FS.readdirSync(EVENTS_PATH).filter((file) =>
        file.endsWith(".js")
    );

    // Executing each event file with a for loop in try{}catch{}
    try {
        for (const file of EVENTS_FILES) {
            const EVENT = require(PATH.join(`../Events`, file));
            if (EVENT.once) {
                bot.once(EVENT.name, (...args) => EVENT.run(bot, ...args));
                TOTAL_FILES++;
            } else {
                bot.on(EVENT.name, (...args) => EVENT.run(bot, ...args));
                TOTAL_FILES++;
            }
            // Adding the success of file to the table.
            table.addRow(file.split(".js")[0], "  ☑");
        }
    } catch (error) {
        bot.logger.error(error);
    }

    bot.logger.success(`${TOTAL_FILES} Events loaded successfully.`);
    // Logging in the table.
    table.alignCenter;
    console.log(table.toString());

    // Logging a beautiful success message to ensure everything is working perfectly.
    try {
        bot.logger.success("All Events are Loaded Successfully!");
    } catch (error) {
        bot.logger.error(error);
    }
};
