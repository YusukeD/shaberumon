import { Client, Interaction, REST, Routes } from 'discord.js'
import { MessageHandler } from '@/app/MessageHandler'
import { CommandList, createCommandList } from '@/app/commands'
import { context } from '@/app/context'
import { InteractionCreateHandler } from '@/app/InteractionCreateHandler'
import { VoiceStateUpdateHandler } from '@/app/VoiceStateUpdateHandler'
import { MongoClient } from 'mongodb'
import { FollowUserStorage } from '@/app/model/FollowUser'
import { DisconnectCommand } from '@/app/commands/DisconnectCommand'
import { FollowMeCommand } from '@/app/commands/FollowMeCommand'
import { JoinCommand } from '@/app/commands/JoinCommand'
import { envConfig } from '@/app/envConfig'
import { VoiceVox } from '@/app/lib/VoiceVox'


(async () => {
    const { discordBotToken, applicationId, voiceVoxEndpoint, mongodbEndpoint } = envConfig()
    const mongoClient = await MongoClient.connect(`${mongodbEndpoint}/shovel`)
    const followUserStorage = new FollowUserStorage({ db: mongoClient.db() })
    const commands: CommandList = createCommandList([
        new DisconnectCommand(),
        new FollowMeCommand(followUserStorage),
        new JoinCommand(),
    ])
    const voiceVox = new VoiceVox(voiceVoxEndpoint)
    const messageHandler = new MessageHandler(voiceVox)
    const interactionCreateHandler = new InteractionCreateHandler(commands)
    const voiceStateUpdateHandler = new VoiceStateUpdateHandler(followUserStorage)
    const rest = new REST().setToken(discordBotToken)
    await rest.put(Routes.applicationCommands(applicationId), {
        body: Object.values(commands).map((command) => command.getData().toJSON()),
    })
    const client = new Client({
        intents: [
            'Guilds',
            'GuildMessages',
            'MessageContent',
            'GuildVoiceStates',
        ],
    })
    client.login(discordBotToken)
        .catch(console.error)

    client.on('ready', () => {
        console.log('ready!')
    })

    client.on('messageCreate', (message) => messageHandler.handle(message, context))
    client.on('interactionCreate', async (interaction: Interaction) => interactionCreateHandler.handle(interaction, context))
    client.on('voiceStateUpdate', (oldState, newState) => voiceStateUpdateHandler.handle(oldState, newState, context))
})()
