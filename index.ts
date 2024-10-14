import {Client, GatewayIntents, } from "./deps.ts"
import config from "./config.ts";

const client = new Client({
    intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MESSAGES],
    token: config.token
})

client.on('ready', () => {
    console.log(client.user?.username, 'is ready')
})

client.connect()