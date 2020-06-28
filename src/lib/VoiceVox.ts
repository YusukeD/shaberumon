import {Readable} from 'stream';
import axios, {AxiosResponse} from 'axios';

export type GetVoiceParams = {
    speaker: number, text: string
}

export class VoiceVox {
    private readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async getVoice(params: GetVoiceParams): Promise<Readable> {
        const query = await axios.post(`${this.endpoint}/audio_query`, {}, {
            params,
        });

        const response: AxiosResponse<Readable> = await axios.post(`${this.endpoint}/synthesis`, query.data, {
            params: {
                speaker: params.speaker,
            },
            responseType: 'stream',
        });

        return response.data;
    }
}
