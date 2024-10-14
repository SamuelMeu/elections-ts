import {ApplicationCommandPermissionType, Client, event, GatewayIntents, TextChannel} from "./deps.ts"
import config from "./config.ts";
import { commands } from "./commands.ts";
import { getGuild, setChannel, setMessage, setRole, switchElections } from "./db.ts";

type vote = {
    userid: number, 
    vote: number
}
type Ballot = {
    guild: number,
    votes: vote[]
}
const ballots: Ballot[] = []

const client = new Client({token: config.token, intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MESSAGES]})

client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    const cmds = await client.interactions.commands.all()
    //deploying commands if !correspond
    if(cmds.size !== commands.length) {
        console.log('Deploying commands', cmds.size, "vs", commands.length)
        client.interactions.commands.bulkEdit(commands).then(() => console.log('done'))
    } else console.log('commands match')
})

client.on('interactionCreate', async (interaction) => {
    if(interaction.isApplicationCommand()) {
        if(!interaction.guild) return interaction.reply('This command is only available in servers')
        //startelections
        if(interaction.name === 'startelections') {
            if(getGuild(interaction.guild?.id!).length == 0) {
                interaction.respond({content: 'Please set the channel first', ephemeral: true})
            }
            else {
                const gg = getGuild(interaction.guild!.id)[0]
                if(gg.elections) {
                    interaction.respond({content: 'Elections already started.', ephemeral: true})
                } else {
                    interaction.respond({content: 'OK.', ephemeral: true})
                    const channel = await interaction.guild!.channels.get(gg.channelID!.toString()) as TextChannel //le toString c juste pour pas que typescript chiale
                    channel.send(gg.message!)
                    switchElections(interaction.guild!.id)
                }
            }
        }
        //setchannel 
        if(interaction.name === 'here') {
            setChannel(interaction.guild?.id!, interaction.channel?.id!)
            interaction.respond({content: 'Channel set', ephemeral: true})
        }
        //setmessage
        if(interaction.name == "setmessage") {
            interaction.showModal({
                title: "Set the message",
                customID: "setmessage_modal",
                components: [{
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: 'TEXT_INPUT',
                            customID: 'message_text',
                            label: 'message',
                            style: 'PARAGRAPH',
                            placeholder: 'Enter the new message sent to the voters'
                        }
                    ]
                }]
            })
        }
        //setrole
        if(interaction.name == "setrole") {
            const role = interaction.options[0].value
            const rl = await interaction.guild.roles.get(role)
            setRole(interaction.guild!.id, role)
            interaction.respond({content: 'Role set as ' + rl!.name, ephemeral: true})
        }
        //endelections
        if(interaction.name == "endelections") {
            const gg = getGuild(interaction.guild!.id)[0]
            if(gg.elections) {
                switchElections(interaction.guild!.id)
                interaction.respond({content: 'Elections ended', ephemeral: true})
            } else {
                interaction.respond({content: 'There is no current elections', ephemeral: true})
            }
        }
    }
    //modals
    if(interaction.isModalSubmit()) {
        if(interaction.customID === 'setmessage_modal') {
            const message = interaction.getComponent('message_text')!.value
            if(!message) return interaction.respond({content: 'No message provided', ephemeral: true})
            setMessage(interaction.guild!.id, message)
            interaction.respond({content: 'Message set', ephemeral: true})
        }
    }
})


client.connect()