import {VoiceState} from 'discord.js';
import {Context} from '@/app/context.js';
import {getVoiceConnection, joinVoiceChannel} from '@discordjs/voice';
import {FollowUserStorage} from '@/app/model/FollowUser.js';


export class VoiceStateUpdateHandler {
    private followUserStorage: FollowUserStorage;

    constructor(followUserStorage: FollowUserStorage) {
        this.followUserStorage = followUserStorage;
    }

    async handle(oldState: VoiceState, newState: VoiceState, context: Context): Promise<void> {
        if (context.mainChannelId === oldState.channelId && oldState.channel?.members.size === 1) {
            const connection = getVoiceConnection(oldState.guild.id);
            connection?.disconnect();
        }

        if (!newState.channelId || !newState.channel || !newState.member?.id) {
            return;
        }

        const followUser = await this.followUserStorage.find({
            guildId: newState.guild.id,
            userId: newState.member?.id,
        });

        if (followUser) {
            const adapterCreator = newState.channel.guild.voiceAdapterCreator;
            if (!adapterCreator) {
                return;
            }
            joinVoiceChannel({
                channelId: newState.channelId,
                guildId: followUser.guildId,
                adapterCreator,
            });
            context.mainChannelId = newState.channelId;
        }
    }
}
