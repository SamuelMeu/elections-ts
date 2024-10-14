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
    }
];