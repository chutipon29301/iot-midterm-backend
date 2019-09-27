import { BehaviorSubject, Observable } from 'rxjs';

export enum TrafficLightColor {
    RED = 'RED',
    GREEN = 'GREEN',
    YELLOW = 'YELLOW',
}

export class TrafficLight {

    private activeLightSubject = new BehaviorSubject<TrafficLightColor>(TrafficLightColor.RED);
    private timeOut: number = 0;
    private colorPresets: TrafficLightColor[] = [TrafficLightColor.RED, TrafficLightColor.YELLOW, TrafficLightColor.GREEN];
    private colorIndex: number = 0;

    public get lightSubject(): BehaviorSubject<TrafficLightColor> {
        return this.activeLightSubject;
    }

    public get activeLight(): Observable<TrafficLightColor> {
        return this.activeLightSubject;
    }

    public setLightColor(color: TrafficLightColor) {
        switch (color) {
            case TrafficLightColor.RED:
                this.setColorIndex(0);
                break;
            case TrafficLightColor.YELLOW:
                this.setColorIndex(1);
                break;
            case TrafficLightColor.GREEN:
                this.setColorIndex(2);
                break;
        }
    }

    public setNextColor() {
        this.setColorIndex((this.colorIndex + 1) % this.colorPresets.length);
    }

    private setColorIndex(index: number) {
        this.colorIndex = index;
        this.activeLightSubject.next(this.colorPresets[index]);
    }
}
