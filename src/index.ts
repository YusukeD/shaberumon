import {Client, Interaction, REST, Routes} from 'discord.js';
import {MessageHandler} from '@/app/MessageHandler.js';
import {CommandList, createCommandList} from '@/app/commands/index.js';
import {context} from '@/app/context.js';
import {InteractionCreateHandler} from '@/app/InteractionCreateHandler.js';
import {VoiceStateUpdateHandler} from '@/app/VoiceStateUpdateHandler.js';
import {MongoClient} from 'mongodb';
import {FollowUserStorage} from '@/app/model/FollowUser.js';
import {DisconnectCommand} from '@/app/commands/DisconnectCommand.js';
import {FollowMeCommand} from '@/app/commands/FollowMeCommand.js';
import {JoinCommand} from '@/app/commands/JoinCommand.js';
import {envConfig} from '@/app/envConfig.js';
import {VoiceVox} from '@/app/lib/VoiceVox.js';


(async () => {
    const {discordBotToken, applicationId, voiceVoxEndpoint, mongodbEndpoint} = envConfig();
    const mongoClient = await MongoClient.connect(`${mongodbEndpoint}/shovel`);
    const followUserStorage = new FollowUserStorage({db: mongoClient.db()});
    const commands: CommandList = createCommandList([
        new DisconnectCommand(),
        new FollowMeCommand(followUserStorage),
        new JoinCommand(),
    ]);
    const voiceVox = new VoiceVox(voiceVoxEndpoint);
    const messageHandler = new MessageHandler(voiceVox);
    const interactionCreateHandler = new InteractionCreateHandler(commands);
    const voiceStateUpdateHandler = new VoiceStateUpdateHandler(followUserStorage);
    const rest = new REST().setToken(discordBotToken);
    await rest.put(Routes.applicationCommands(applicationId), {
        body: Object.values(commands).map((command) => command.getData().toJSON()),
    });
    const client = new Client({
        intents: [
            'Guilds',
            'GuildMessages',
            'MessageContent',
            'GuildVoiceStates',
        ],
    });
    client.login(discordBotToken)
        .catch(console.error);

    client.on('ready', () => {
        console.log('ready!');
    });

    client.on('messageCreate', (message) => messageHandler.handle(message, context));
    client.on('interactionCreate', async (interaction: Interaction) => interactionCreateHandler.handle(interaction, context));
    client.on('voiceStateUpdate', (oldState, newState) => voiceStateUpdateHandler.handle(oldState, newState, context));
})();
