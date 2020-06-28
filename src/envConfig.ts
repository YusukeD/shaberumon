import * as process from 'process';


function loadEnv(name: string) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not set.`);
    }

    return value;
}

export const envConfig = () => {
    const discordBotToken = loadEnv('DISCORD_BOT_TOKEN');
    const applicationId = loadEnv('APPLICATION_ID');
    const voiceVoxEndpoint = loadEnv('VOICEVOX_ENDPOINT');
    const mongodbEndpoint = loadEnv('MONGODB_ENDPOINT');

    return {discordBotToken, applicationId, voiceVoxEndpoint, mongodbEndpoint};
};
