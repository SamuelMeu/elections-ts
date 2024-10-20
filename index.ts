import {ApplicationCommandPermissionType, Client, Embed, event, GatewayIntents, TextChannel} from "./deps.ts"
import config from "./config.ts";
import { commands } from "./commands.ts";
import { getGuild, setChannel, setMessage, setRole, switchElections } from "./db.ts";
import { electionsstarted, nochannel, norole, notinserver, startelections, channelset, messageset, roleset, tie, listresults, won, noelections, electionsend, permissionmissing, voteupdated, voteregistered, elecmsg } from "./embeds.ts";

type vote = {
    userid: string, 
    vote: string
}
type Ballot = {
    guild: string,
    votes: vote[]
}
const ballots: Ballot[] = []

const client = new Client({token: config.token, intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MESSAGES, GatewayIntents.GUILD_MEMBERS]})

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
        if(!interaction.guild) return interaction.respond({embeds: [notinserver], ephemeral: true})
        //startelections
        if(interaction.name === 'startelections') {
            if(interaction.user.id !== interaction.guild?.ownerID) return interaction.respond({embeds: [permissionmissing], ephemeral: true})
            if(getGuild(interaction.guild?.id!).length == 0) {
                interaction.respond({embeds: [nochannel], ephemeral: true})
            }
            else {
                const gg = getGuild(interaction.guild!.id)[0]
                if(gg.role == 'none') return interaction.respond({embeds: [norole], ephemeral: true})
                if(gg.elections) {
                    interaction.respond({embeds: [electionsstarted], ephemeral: true})
                } else {
                    interaction.respond({embeds: [startelections], ephemeral: true})
                    const channel = await interaction.guild!.channels.get(gg.channelID!.toString()) as TextChannel //le toString c juste pour pas que typescript chiale
                    channel.send({embeds: [elecmsg.setDescription(gg.message!.toString())]})
                    switchElections(interaction.guild!.id)
                }
            }
        }
        //setchannel 
        if(interaction.name === 'here') {
            if(interaction.user.id !== interaction.guild?.ownerID) return interaction.respond({embeds: [permissionmissing], ephemeral: true})
            setChannel(interaction.guild?.id!, interaction.channel?.id!)
            interaction.respond({embeds: [channelset], ephemeral: true})
        }
        //setmessage
        if(interaction.name == "setmessage") {
            if(interaction.user.id !== interaction.guild?.ownerID) return interaction.respond({embeds: [permissionmissing], ephemeral: true})
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
            if(interaction.user.id !== interaction.guild?.ownerID) return interaction.respond({embeds: [permissionmissing], ephemeral: true})
            const role = interaction.options[0].value
            const rl = await interaction.guild.roles.get(role)
            setRole(interaction.guild!.id, role)
            const emb = roleset
            emb.setDescription('Role set as ' + rl?.name)
            interaction.respond({embeds: [emb], ephemeral: true})
        }
        //endelections
        if(interaction.name == "endelections") {
            if(interaction.user.id !== interaction.guild?.ownerID) return interaction.respond({embeds: [permissionmissing], ephemeral: true})
            const gg = getGuild(interaction.guild!.id)[0]
            if(gg.elections) {
                //remove old role
                const old = await interaction.guild.roles.get(gg.role!.toString())
                const members = await interaction.guild.members.fetchList()
                const guy = members.find(m => m.roles.get(gg.role!.toString()))
                if(guy) guy.roles.remove(gg.role!.toString())
                console.log('removed role from', guy?.user.username)
                switchElections(interaction.guild!.id)
                interaction.respond({embeds: [electionsend], ephemeral: true})
                //lecture des ballots 
                const results = ballots.find(b => b.guild === interaction.guild!.id)
                const channel = await interaction.guild!.channels.get(gg.channelID!.toString()) as TextChannel
                if(!results) return
                const map = results.votes.reduce((acc, e) => acc.set(e.vote, (acc.get(e.vote) || 0) + 1), new Map());
                const sorted = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
                let ls:string = ""
                map.forEach((v, k) => ls += `<@${k}>: ${v}\n`)
                const lsres = listresults
                lsres.setDescription(ls)
                //check if there is a tie
                if(sorted.values().toArray()[0] == sorted.values().toArray()[1]) {
                    return channel.send({embeds: [tie, lsres]})
                }
                //winner
                const winner = sorted.keys().next().value
                channel.send({embeds: [won.setDescription(`<@${winner}>`), lsres]})
                //give the role
                const member = await interaction.guild.members.get(winner)
                member?.roles.add(gg.role!.toString())
                ballots.find(m => m.guild === interaction.guild!.id)!.votes = []
            } else {
                interaction.respond({embeds: [noelections], ephemeral: true})
            }
        }
        //vote
        if(interaction.name == "vote") {
            const gg = getGuild(interaction.guild!.id)[0]
            if(!gg.elections) return interaction.respond({embeds: [noelections], ephemeral: true})
            const candidate = interaction.options[0].value
            const votes = ballots.find(b => b.guild == interaction.guild!.id)
            const vt:vote = {userid: interaction.user.id, vote: candidate}
            if(!votes) ballots.push({guild: interaction.guild!.id, votes: [vt]}) && interaction.respond({embeds: [voteregistered], ephemeral: true})
            else {
                const loc = votes.votes.find(v => v.userid === interaction.user.id)
                if(loc) {
                    loc.vote = candidate
                    interaction.respond({embeds: [voteupdated], ephemeral: true})
                }
                else {
                    votes.votes.push(vt)
                    interaction.respond({embeds: [voteregistered], ephemeral: true})
                }
            }
        }
    }
    //modals
    if(interaction.isModalSubmit()) {
        if(interaction.customID === 'setmessage_modal') {
            const message = interaction.getComponent('message_text')!.value
            if(!message) return interaction.respond({content: 'No message provided', ephemeral: true})
            setMessage(interaction.guild!.id, message)
            interaction.respond({embeds: [messageset], ephemeral: true})
        }
    }
})


client.connect()