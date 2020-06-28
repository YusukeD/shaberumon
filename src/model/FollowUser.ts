import {Storage} from '@/app/model/Storage.js';
import {Collection, Db} from 'mongodb';

export type FollowUser = {
    guildId: string
    userId: string
}

export class FollowUserStorage implements Storage<FollowUser> {
    private readonly collection: Collection<FollowUser>;

    constructor(props: { db: Db }) {
        this.collection = props.db.collection<FollowUser>('followUsers');
    }

    async delete(entity: FollowUser): Promise<void> {
        await this.collection.deleteOne(entity);
    }

    async find(entity: FollowUser): Promise<FollowUser | null> {
        return await this.collection.findOne(entity);
    }

    async save(entity: FollowUser): Promise<void> {
        await this.collection.insertOne(entity);
    }
}
