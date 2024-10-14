import { SlashCommandPartial, SlashCommandOptionType } from "./deps.ts";

export const commands: SlashCommandPartial[] = [
    {
        name: "startelections",
        description: "Starts the elections",
        options: [],
    },
    {
        name: "here",
        description: "Sets this channel as the voting channel",
        options: [],
    }, 
    {
        name: "setmessage",
        description: "opens a promt to set the message for the elections"
    },
    {
        name: "setrole",
        description: "sets the role of the president",
        options: [
            {
                name: "role",
                description: "name of the role",
                type: SlashCommandOptionType.ROLE,
                required: true
            }
        ]
    },
    {
        name: "endelections",
        description: "ends the elections",
    }
];