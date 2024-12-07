<p align="center">
  <img src="./assets/banner.png" height="400" width="800"><br>
  <img src="https://img.shields.io/badge/version-0.0.1-blue?style=for-the-badge">
</p>

# Mittu ~ A discord bot template

> This template is built with [bun](https://bun.sh/) & [discord.js](https://discord.js.org/) And with the help of [ms](https://www.npmjs.com/package/ms), [ascii-table](https://www.npmjs.com/package/ascii-table), and [dotenv](https://www.npmjs.com/package/dotenv) npm packages. It is made to get people building their discord bots within seconds along with all the basic things. It is largely inspired by many outstanding developers out there. Feel free to use it in any project of your choice, give suggestions or any errors that you encounter.

Setup your bot's info at `./src/Configs/Main.json` or `.env.example` (make sure to change the name to `.env` once done)

You can change status, intents, and global variables of the bot over at `./src/index.js`. To know more about intents, [click here](https://discord.com/developers/docs/events/gateway#gateway-intents)

The template has logging system, for console, and for crash reports. Where crash reports are stored at `./logs/error.log`. Console colors and timings data is added for better logging. All these settings can be seen or changed over at `./src/Utils/Logger.js` & `./src/Handlers/ErrorHandler.js`.

_Feel free to explore different parts of this templete and get that thrill of finding out its' workings (disclaimer: it is super simple!)_

<details>
<summary>This template includes three distinct operational modes: <b>Testing Mode</b>, <b>Production Mode</b>, and <b>Maintenance Mode</b>. Each mode is designed to streamline development, deployment, and user experience. Below is a detailed explanation of each mode to help you understand their purposes and functionalities.</summary>

### 1. Testing mode

> It is perfect for developers who want to experiment with commands or functionality without affecting the live environment. In this mode:

- All commands are deployed exclusively to a test guild (server) for isolated testing (setup testing guild in `.env` or `./src/Configs/Main.json`).

- Changes can be made safely, and the bot's behavior can be thoroughly validated before global deployment.

- Useful for troubleshooting and debugging.

### 2. Production mode

> Production Mode (also referred to as Deploying Mode) is for live deployment of your bot. It offers two deployment options:

- **Global Deployment**: Commands are registered globally, making them accessible across all servers where the bot is added. Note that global updates may take up to an hour to propagate fully due to Discord's caching.

- **Guild-Specific Deployment**: Commands are registered only within specified guilds (servers). This is useful for private or staged rollouts where you want to deploy features to select servers before going global.

### 3. Maintenance Mode

> It ensures a seamless experience for end-users while the bot undergoes updates or downtime. In this mode:

- All command executions are temporarily disabled.

- Users attempting to run commands will receive a "Work in Progress" message instead of the usual response.

- This prevents unexpected behavior or errors during updates and helps maintain a professional experience.

</details>

---

## Tech stack:

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" height="50" alt="javascript logo" />
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHaNT3Fi8RMNUpPDk-Zddeo2FTvDN3Sye5AA&s" height="50" alt="dotenv logo" />
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_poHZD7zedIFVi_xyvSwkXCSsfmhNYElEQA&s" height="50" alt="bun logo" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discordjs/discordjs-original.svg" height="50" alt="discordjs logo"  />
  <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" height="50" alt="discord logo"  />
  <img src="https://static-00.iconduck.com/assets.00/node-js-icon-1817x2048-g8tzf91e.png" height="50" alt="nodejs logo"  />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1024px-Npm-logo.svg.png" height="40" alt="npm logo"  />
</div>

###

---

**Here is how you create new commands:**

_Interaction commands ——_

> ./src/InteractionCmds/

```js
module.exports = {
  name: "", // name of the command
  description: "", // description of the command
  type: 1, // type of the command, CHAT_INPUT (1) [upcoming: USER(2), MESSAGE(3)]
  localizations: [
    // (Optional)
    {
      lang: "", // https://discord.com/developers/docs/reference#locales
      name: "", // name in selected language
      description: "", // description in selected language
    },
  ],
  devOnly: false, // if you want only developers' of the bot to use the command, setup list of devlopers at `src/Configs/Cool.json`
  permissions: ["", ""], // if any extra permissions are required for the user to have
  roles: ["", ""], // only certain roles can run the command (enter the id of the roles)
  cooldown: 10000, // cooldown in ms

  run: async (bot, interaction) => {
    // rest of your code...
  },
};
```

> [!NOTE]
> Options, Sub-command Options, and Sub-Group-command Options cannot be used all together, if you have added all three in a command file, then the priority will be, Sub-Group-command -> Sub-command -> Options

_Options ——_

```js
options: [
  {
    name: "", // name of the option
    description: "", // description of the option
    type: 3, // String(3), Integer(4), Boolean(5), User(6), Channel(7), Role(8), Mentionable(9), Number(10), Attachment(11)
    required: false, // (Optional) [DEFAULT: false] if the option is a must or not
    localizations: [
      // (Optional)
      {
        lang: "", // https://discord.com/developers/docs/reference#locales
        name: "", // name in selected language
        description: "", // description in selected language
      },
    ],
    min: 0, // (Optional) minimum value
    max: 100, // (Optional) maximum value
    choices: [
      { name: "Option 1", value: "option1" },
      // { name: "Option 2", value: "option2" },
      // { name: "Option 3", value: "option3" },
    ],
  },
];
```

_Sub-commands ——_

```js
subOptions: [
    {
        name: "", // name of the sub-comamnd
        description: "", // description of the sub-command
        localizations: [
          // (Optional)
          {
            lang: "", // https://discord.com/developers/docs/reference#locales
            name: "", // name in selected language
            description: "", // description in selected language
          },
        ],
        options: [
            // similar to the options as given above
        ],
    },
],
```

_Sub-Group-commands ——_

```js
subGroupOptions: [
    {
        name: "", // name of the sub-comamnd
        description: "", // description of the sub-command
        localizations: [
          // (Optional)
          {
            lang: "", // https://discord.com/developers/docs/reference#locales
            name: "", // name in selected language
            description: "", // description in selected language
          },
        ],
        options: [
            // similar to the options as given above
        ],
    },
],
```

> [!WARNING]
> Message commands requires the 'MessageContent' intent to run, according to the Discord application rules, which requires you to turn on MessageContent intent on the Discord devloper portal, and add that intent in 'index.js' file, however this will also require verification once you hit 100 servers/ guilds.

_Message commands ——_

> ./src/MessageCmds/

```js
module.exports = {
  name: "", // name of the command
  description: "", // description of the command
  devOnly: false, // if you want only developers' of the bot to use the command, setup list of devlopers at `src/Configs/Cool.json`
  permissions: ["", ""], // if any extra permissions are required for the user to have
  roles: ["", ""], // only certain roles can run the command (enter the id of the roles)
  cooldown: 10000, // cooldown in ms

  run: async (bot, message, args) => {
    // rest of your code...
  },
};
```

---

**Here is how you create new events:**

> ./src/Events/

```js
module.exports = {
  name: "", // name of the event
  once: true, // to run once or not
  run: async (bot, error) => {
    // rest of your code...
  },
};
```

Contributions are welcome! 🫡

Made with ❤️

p.s., if you liked the template and want to support for more upgrades and unique features, do consider to star the repo. or contribute as per your likings. Have safe and hungry development!
