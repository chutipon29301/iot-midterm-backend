import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { TrafficLight, TrafficLightColor } from '../classes/TrafficLight';
import { Observable, combineLatest, BehaviorSubject, interval } from 'rxjs';
import { WebSocketServer, WebSocketGateway, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
    SOCKET_ON_TRAFFIC_LIGHT_CHANGE,
    MQTT_TRAFFIC_LIGHT_EVENT,
    SOCKET_ON_IR_SENSOR_CHANGE,
    SOCKET_ON_COUNTER_CHANGE,
} from '../constant';
import { auditTime } from 'rxjs/operators';
import { SensorModeController } from '../classes/SensorModeController';
import { ManualModeController } from '../classes/ManualModeController';
import { AutoModeController } from '../classes/AutoModeController';

export enum TrafficLightSystemMode {
    AUTO = 'AUTO',
    MANUAL = 'MANUAL',
    SENSOR = 'SENSOR',
}
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
    private mode: BehaviorSubject<TrafficLightSystemMode> = new BehaviorSubject<TrafficLightSystemMode>(TrafficLightSystemMode.MANUAL);
    private manualModeController: ManualModeController = null;
    private sensorModeController: SensorModeController = null;
    private autoModeController: AutoModeController = null;

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
        this.mode.subscribe({
            next: (mode: TrafficLightSystemMode) => {
                this.autoModeController.clear();
                this.sensorModeController.clear();
                switch (mode) {
                    case TrafficLightSystemMode.MANUAL:
                        for (const trafficLight of this.trafficLights) {
                            trafficLight.reset();
                        }
                        this.manualModeController = null;
                        this.autoModeController = null;
                        this.sensorModeController = null;
                        break;
                    case TrafficLightSystemMode.AUTO:
                        this.manualModeController = null;
                        this.autoModeController = new AutoModeController(this.trafficLights, this.counter);
                        this.sensorModeController = null;
                        break;
                    case TrafficLightSystemMode.SENSOR:
                        this.manualModeController = null;
                        this.autoModeController = null;
                        this.sensorModeController = new SensorModeController(this.trafficLights, this.irStates);
                        break;
                }
            },
        });
    }

    handleConnection() {
        this.server.emit(SOCKET_ON_TRAFFIC_LIGHT_CHANGE, this.trafficLights.map(o => o.lightSubject.value));
        this.server.emit(SOCKET_ON_IR_SENSOR_CHANGE, this.irStates.map(o => o.value));
    }

    public setTrafficLightSystemMode(mode: TrafficLightSystemMode) {
        this.mode.next(mode);
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
