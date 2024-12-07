import("dotenv");
const Config = require("./Configs/Main.json");
import { Logger } from "./Utils/Logger";
import {
    Client,
    GatewayIntentBits,
    Partials,
    ActivityType,
    PresenceUpdateStatus,
    Collection,
} from "discord.js";

const bot = new Client({
    restTimeOffset: 0,
    // shards: auto,

    partials: [
        //Partials.Channel,
        //Partials.Message,
        //Partials.GuildMember,
        //Partials.ThreadMember,
        //Partials.Reaction,
        //Partials.User,
        //Partials.GuildScheduledEvent,
    ],
    intents: [
        // Object.values(GatewayIntentBits).filter(x => !isNaN(x)).reduce((bit, next) => bit |= next, 0) // all bits
        GatewayIntentBits.Guilds, // for guild related things
        //GatewayIntentBits.GuildMembers, // for guild members related things
        GatewayIntentBits.GuildModeration, // for manage guild bans
        GatewayIntentBits.GuildEmojisAndStickers, // for manage emojis and stickers
        GatewayIntentBits.GuildIntegrations, // for discord Integrations
        GatewayIntentBits.GuildWebhooks, // for discord webhooks
        GatewayIntentBits.GuildInvites, // for guild invite managing
        GatewayIntentBits.GuildVoiceStates, // for voice related things
        //GatewayIntentBits.GuildPresences, // for user presence things
        GatewayIntentBits.GuildMessages, // for guild messages things
        GatewayIntentBits.GuildMessageReactions, // for message reactions things
        GatewayIntentBits.GuildMessageTyping, // for message typing
        GatewayIntentBits.DirectMessages, // for dm messages
        GatewayIntentBits.DirectMessageReactions, // for dm message reaction
        GatewayIntentBits.DirectMessageTyping, // for dm message typing
        GatewayIntentBits.MessageContent, // enable if you need message content things
    ],
    presence: {
        activities: [
            {
                name: `Dreams!`,
                type: ActivityType.Listening,
            },
        ],
        status: PresenceUpdateStatus.Online,
    },
    failIfNotExists: false,
    allowedMentions: {
        parse: ["roles", "everyone", "users"],
        repliedUser: true,
    },
});

// Defining the global stuffs.
bot.slashCmds = new Collection();
bot.msgCmds = new Collection();
bot.cooldown = new Collection();
bot.config = Config || process.env;
bot.cool = require("./Configs/Cool.json");
bot.logger = new Logger({ logLevel: 0, prefix: "Mittu", dateEnabled: true });

// Getting our Handlers on the mark!
["Events", "Commands", "ErrorHandler"].forEach((handler) => {
    require(`./Handlers/${handler}`)(bot);
});

bot.login(Config.TOKEN || process.env.TOKEN);
