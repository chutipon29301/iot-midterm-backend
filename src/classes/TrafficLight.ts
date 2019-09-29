import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum TrafficLightColor {
    RED = 'RED',
    GREEN = 'GREEN',
    YELLOW = 'YELLOW',
}

export class TrafficLight {

    private activeLightSubject: BehaviorSubject<TrafficLightColor> = new BehaviorSubject<TrafficLightColor>(TrafficLightColor.RED);
    private countdown: number = -1;
    private changeColorCountdown: number[] = [];
    private colorPresets: TrafficLightColor[] = [TrafficLightColor.GREEN, TrafficLightColor.YELLOW, TrafficLightColor.RED];
    private colorIndex: number = 0;

    constructor(private readonly counter: Observable<number>) {

    }

    public get lightSubject(): BehaviorSubject<TrafficLightColor> {
        return this.activeLightSubject;
    }

    public get activeLight(): Observable<TrafficLightColor> {
        return this.activeLightSubject;
    }

    public get observableCountdown(): Observable<number> {
        return this.counter.pipe(
            map(() => {
                if (this.countdown === 0) {
                    this.setNextColor();
                }
                if (this.countdown > -1) {
                    return this.countdown--;
                } else {
                    if (this.changeColorCountdown.length > 0) {
                        this.countdown = this.changeColorCountdown[0];
                        this.changeColorCountdown.splice(0, 1);
                    }
                    return this.countdown;
                }
            }),
        );
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

    // public circulateToRed() {
    //     if (this.currentColor === TrafficLightColor.RED) { return; }
    //     this.setNextColor();
    //     if (this.currentColor === TrafficLightColor.GREEN) { return; }
    //     setTimeout(() => {
    //         this.setNextColor();
    //     }, 3000);
    // }

    private setColorIndex(index: number) {
        this.colorIndex = index;
        this.activeLightSubject.next(this.colorPresets[index]);
    }
}
