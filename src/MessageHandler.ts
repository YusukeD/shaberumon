import {Message} from 'discord.js';
import {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    NoSubscriberBehavior,
    StreamType,
} from '@discordjs/voice';
import {VoiceVox} from '@/app/lib/VoiceVox.js';
import {Context} from '@/app/context.js';


export class MessageHandler {
    private readonly voiceVox: VoiceVox;

    constructor(voiceVox: VoiceVox) {
        this.voiceVox = voiceVox;
    }

    /**
     *
     * @param message {Message}
     * @param context
     * @returns {Promise<void>}
     */
    async handle(message: Message, context: Context): Promise<void> {
        if (message.author.bot || context.mainChannelId !== message.channelId) {
            return;
        }

        const connection = getVoiceConnection(message.guildId || '');
        if (!connection) {
            return;
        }

        const voice = await this.voiceVox.getVoice({speaker: 1, text: message.content});
        const audioResource = createAudioResource(voice, {
            inputType: StreamType.Arbitrary,
        });
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        player.play(audioResource);
        connection.subscribe(player);
    }
}
