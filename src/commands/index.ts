import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';
import {Context} from '@/app/context.js';

export function createCommandList(commands: CommandInterface[]) {
    return commands.map(command => ({
        [command.getData().name]: command,
    })).reduce((acc, value) => ({...acc, ...value}), {});
}

export interface CommandInterface {
    getData(): SlashCommandBuilder,

    execute(interaction: ChatInputCommandInteraction, context: Context): Promise<void>
}

export type CommandList = {
    [key: string]: CommandInterface
}
