import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { TrafficLight, TrafficLightColor } from '../classes/TrafficLight';
import { Observable, combineLatest } from 'rxjs';
import { WebSocketServer, WebSocketGateway, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { onTrafficLightChange } from '../constant';
@WebSocketGateway()
@Injectable()
export class TrafficLightService implements OnModuleInit, OnGatewayConnection {

    @Client({
        transport: Transport.MQTT,
        options: {
            url: process.env.MQTT_CONNECTION_STRING,
        },
    })
    private client: ClientProxy;
    @WebSocketServer()
    private server: Server;
    private trafficLights: TrafficLight[] = [
        new TrafficLight(),
        new TrafficLight(),
        new TrafficLight(),
        new TrafficLight(),
    ];

    onModuleInit() {
        this.observableTrafficLightColors.subscribe({
            next: (trafficLightColors: TrafficLightColor[]) => {
                this.client.emit('traffic-light', trafficLightColors);
                this.server.emit(onTrafficLightChange, trafficLightColors);
            },
        });
    }

    handleConnection() {
        this.server.emit(onTrafficLightChange, this.trafficLights.map(o => o.lightSubject.value));
    }

    public changeLightColor(index: number, color: TrafficLightColor) {
        this.trafficLights[index].lightSubject.next(color);
    }

    public async sendPingMqttMessage() {
        await this.client.emit('ping', 'pong').toPromise();
    }

    private get observableTrafficLightColors(): Observable<TrafficLightColor[]> {
        return combineLatest(this.trafficLights.map(o => o.activeLight));
    }
}
