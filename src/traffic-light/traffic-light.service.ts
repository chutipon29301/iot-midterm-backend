import { Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
@Injectable()
export class TrafficLightService {
    @Client({
        transport: Transport.MQTT,
        options: {
            url: process.env.MQTT_CONNECTION_STRING,
        },
    })
    private client: ClientProxy;

    public async sendPingMqttMessage() {
        await this.client.emit('traffic-light', 'Hello World').toPromise();
    }
}
