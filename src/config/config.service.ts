import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {

    public getMongodbConnectionString(): string {
        const connectionString = process.env.MONGO_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('MONGO_CONNECTION_STRING is not defined');
        }
        return connectionString;
    }
}
