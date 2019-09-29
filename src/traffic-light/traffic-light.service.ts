import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { TrafficLight, TrafficLightColor } from '../classes/TrafficLight';
import { Observable, combineLatest, BehaviorSubject, interval } from 'rxjs';
import { WebSocketServer, WebSocketGateway, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SOCKET_ON_TRAFFIC_LIGHT_CHANGE, MQTT_TRAFFIC_LIGHT_EVENT, SOCKET_ON_IR_SENSOR_CHANGE, SOCKET_ON_COUNTER_CHANGE } from '../constant';
import { auditTime } from 'rxjs/operators';
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

    private counter: Observable<number> = interval(1000);
    private trafficLights: TrafficLight[] = [
        new TrafficLight(this.counter),
        new TrafficLight(this.counter),
        new TrafficLight(this.counter),
        new TrafficLight(this.counter),
    ];
    private irStates: Array<BehaviorSubject<boolean>> = [
        new BehaviorSubject(false),
        new BehaviorSubject(false),
    ];

    private get observableTrafficLightColors(): Observable<TrafficLightColor[]> {
        return combineLatest(this.trafficLights.map(o => o.activeLight));
    }

    private get observableIRStates(): Observable<boolean[]> {
        return combineLatest(this.irStates);
    }

    private get observableCountdowns(): Observable<number[]> {
        return combineLatest(this.trafficLights.map(o => o.observableCountdown)).pipe(
            auditTime(1000),
        );
    }

    onModuleInit() {
        this.observableTrafficLightColors.subscribe({
            next: (trafficLightColors: TrafficLightColor[]) => {
                this.client.emit(MQTT_TRAFFIC_LIGHT_EVENT, trafficLightColors);
                this.server.emit(SOCKET_ON_TRAFFIC_LIGHT_CHANGE, trafficLightColors);
            },
        });
        this.observableIRStates.subscribe({
            next: (irStates: boolean[]) => {
                this.server.emit(SOCKET_ON_IR_SENSOR_CHANGE, irStates);
            },
        });
        this.observableCountdowns.subscribe({
            next: (countdowns: number[]) => {
                this.server.emit(SOCKET_ON_COUNTER_CHANGE, countdowns);
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
        this.trafficLights[index].setLightColor(color);
    }

    public setNextColorOnIndex(index: number) {
        this.trafficLights[index].setNextColor();
    }

    public changeIRState(index: number, state: number) {
        this.irStates[index].next(state === 1);
    }

    public addTrafficLightCountdownOnIndex(index: number, countdown: number) {
        this.trafficLights[index].addCountdownQueue(countdown);
    }

    public setTrafficLightColorToRedOnIndex(index: number) {
        this.trafficLights[index].setColorToRed();
    }

    public setTrafficLightSetToGreenOnIndex(index: number) {
        for (let i = 0; i < this.trafficLights.length; i++) {
            if (i === index) {
                this.trafficLights[i].setColorToGreen();
            } else {
                this.trafficLights[i].setColorToRed();
            }
        }
    }

}
