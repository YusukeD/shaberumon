import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Context } from '@/app/context'
import { CommandInterface } from '@/app/commands'
import { FollowUserStorage } from '@/app/model/FollowUser'

export class FollowMeCommand implements CommandInterface {
    private followUserStorage: FollowUserStorage

    constructor(followUserStorage: FollowUserStorage) {
        this.followUserStorage = followUserStorage
    }

    getData(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName('follow-me')
            .setDescription('Set up to join with you when you join the channel.')
    }

    async execute(interaction: ChatInputCommandInteraction, context: Context) {
        const user = await interaction.guild?.members.fetch({ user: interaction.user })
        if (!user) {
            return
        }

        const entity = {
            guildId: user.guild.id,
            userId: user.id,
        }

        if (!await this.followUserStorage.find(entity)) {
            await this.followUserStorage.save(entity)
        }
        await interaction.reply(`${user.displayName}さんがボイスチャンネル参加時、同時に参加するよう設定しました。`)
    }
}
