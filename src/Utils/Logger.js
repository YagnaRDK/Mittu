import { currentDateTime } from "./Functions";

const Colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
};

// Helper function to validate and get colors
const getColorCodes = (colorNames = []) => {
    return colorNames
        .map(color => Colors[color] || Colors.FgWhite)
        .join('');
};

// Core logging function
export const colorLog = ({
    colors = ["FgGreen"],
    text = "No Text added",
    dateEnabled = true,
    prefix
} = {}) => {
    const colorCodes = getColorCodes(colors);
    const dateTime = dateEnabled ? `${Colors.FgCyan}${currentDateTime()}${Colors.Reset} ` : '';
    const prefixText = prefix ? `${Colors.FgCyan}${prefix}${Colors.Reset} ${Colors.FgRed}🦄${Colors.Reset} ` : '';

    console.log(`${dateTime}${prefixText}${colorCodes}${text.join(' ')}${Colors.Reset}`);
};

export class Logger {
    /**
     * Create a Logger with logLevels, default logLevel == 1, which means, no debugs.
     * @param {{prefix: string|false, dateEnabled: boolean, logLevel: 0|1|2|3|4|5}} options - The options value.
     */
    constructor({ prefix = "BOT-LOG", dateEnabled = true, logLevel = 1 } = {}) {
        this.prefix = prefix;
        this.dateEnabled = dateEnabled;
        this.logLevel = logLevel;
    }

    // Helper to generate consistent log output
    logMessage(level, colors, ...text) {
        if (this.logLevel > level) return;
        colorLog({
            colors,
            text,
            dateEnabled: this.dateEnabled,
            prefix: typeof this.prefix === "string" ? `${level} - ${this.prefix}` : level,
        });
    }

    debug(...text) {
        this.logMessage(0, ["Dim"], ...text);
    }

    info(...text) {
        this.logMessage(1, ["FgGreen"], ...text);
    }

    log(...text) {
        this.logMessage(2, ["FgWhite"], ...text);
    }

    success(...text) {
        this.logMessage(3, ["FgGreen", "Bright"], ...text);
    }

    warn(...text) {
        this.logMessage(4, ["FgYellow"], ...text);
    }

    error(...text) {
        this.logMessage(5, ["FgRed"], ...text);
    }
}
