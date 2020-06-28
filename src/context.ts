import {FollowUser} from '@/app/model/FollowUser.js';

export type Context = {
    mainChannelId: string | null
    followUsers: FollowUser[]
}

export const context: Context = {
    mainChannelId: null,
    followUsers: [],
};
