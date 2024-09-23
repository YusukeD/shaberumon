import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'
import { Context } from '@/app/context'
import { CommandInterface } from '@/app/commands'

export class DisconnectCommand implements CommandInterface {
    getData(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName('disconnect')
            .setDescription('Disconnect to voice channel.')
    }

    async execute(interaction: ChatInputCommandInteraction, context: Context) {
        const connection = getVoiceConnection(interaction.guildId || '')
        if (!connection) {
            return
        }

        context.mainChannelId = null
        connection.disconnect() && await interaction.reply('接続を終了しました。')
    }
}
