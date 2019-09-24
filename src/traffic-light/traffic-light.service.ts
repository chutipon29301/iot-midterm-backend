import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { TrafficLight, TrafficLightColor } from '../classes/TrafficLight';
import { Observable, combineLatest } from 'rxjs';
import { WebSocketServer, WebSocketGateway, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SOCKET_ON_TRAFFIC_LIGHT_CHANGE, MQTT_TRAFFIC_LIGHT_EVENT } from '../constant';
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
                this.client.emit(MQTT_TRAFFIC_LIGHT_EVENT, trafficLightColors);
                this.server.emit(SOCKET_ON_TRAFFIC_LIGHT_CHANGE, trafficLightColors);
            },
        });
    }

    handleConnection() {
        this.server.emit(SOCKET_ON_TRAFFIC_LIGHT_CHANGE, this.trafficLights.map(o => o.lightSubject.value));
    }

    public async syncTrafficLightColor() {
        const lights = this.trafficLights.map(o => o.lightSubject.value);
        this.server.emit(SOCKET_ON_TRAFFIC_LIGHT_CHANGE, lights);
        this.client.emit(MQTT_TRAFFIC_LIGHT_EVENT, lights);
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
