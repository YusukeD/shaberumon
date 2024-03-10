import { Message } from 'discord.js'
import {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    NoSubscriberBehavior,
    StreamType,
} from '@discordjs/voice'
import { VoiceVox } from '@/app/lib/VoiceVox'
import { Context } from '@/app/context'


export class MessageHandler {
    private readonly voiceVox: VoiceVox

    constructor(voiceVox: VoiceVox) {
        this.voiceVox = voiceVox
    }

    /**
     *
     * @param message {Message}
     * @param context
     * @returns {Promise<void>}
     */
    async handle(message: Message, context: Context): Promise<void> {
        if (message.author.bot || context.mainChannelId !== message.channelId) {
            return
        }

        const connection = getVoiceConnection(message.guildId || '')
        if (!connection) {
            return
        }
        
        let text = message.content
        if (message.content.startsWith('http://') || message.content.startsWith('https://')) {
            text = 'URL省略'
        }
        const voice = await this.voiceVox.getVoice({speaker: 1, text})
        const audioResource = createAudioResource(voice, {
            inputType: StreamType.Arbitrary,
        })
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        })
        player.play(audioResource)
        connection.subscribe(player)
    }
}
