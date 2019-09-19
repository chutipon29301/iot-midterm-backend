import { BehaviorSubject, Observable } from 'rxjs';

export enum TrafficLightColor {
    RED = 'RED',
    GREEN = 'GREEN',
    YELLOW = 'YELLOW',
}

export class TrafficLight {

    private activeLightSubject = new BehaviorSubject<TrafficLightColor>(TrafficLightColor.RED);

    public get lightSubject(): BehaviorSubject<TrafficLightColor> {
        return this.activeLightSubject;
    }

    public get activeLight(): Observable<TrafficLightColor> {
        return this.activeLightSubject;
    }
}
