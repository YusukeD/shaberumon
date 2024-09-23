import { Interaction } from 'discord.js'
import { Context } from '@/app/context'
import { CommandList } from '@/app/commands'

export class InteractionCreateHandler {
    private readonly commands: CommandList

    constructor(commands: CommandList) {
        this.commands = commands
    }

    async handle(interaction: Interaction, context: Context): Promise<void> {
        if (!interaction.isChatInputCommand()) return

        const command = this.commands[interaction.commandName]
        command && await command.execute(interaction, context)
    }
}
