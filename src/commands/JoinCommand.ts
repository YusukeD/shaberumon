import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';
import {joinVoiceChannel} from '@discordjs/voice';
import {Context} from '@/app/context.js';
import {CommandInterface} from '@/app/commands/index.js';

export class JoinCommand implements CommandInterface {
    getData(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName('join')
            .setDescription('Connect to voice channel.');
    }

    async execute(interaction: ChatInputCommandInteraction, context: Context) {
        const user = await interaction.guild?.members.fetch({user: interaction.user});
        if (!user) {
            return;
        }
        const channelId = user.voice.channel?.id || '';
        const adapterCreator = user.voice.channel?.guild.voiceAdapterCreator;
        if (!adapterCreator) {
            return;
        }
        joinVoiceChannel({
            channelId,
            guildId: user.guild.id,
            adapterCreator,
        });
        context.mainChannelId = interaction.channelId;
        await interaction.reply('参加しました');
    }
}
