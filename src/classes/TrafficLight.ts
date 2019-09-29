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
    private colorIndex: number = 2;

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
                if (this.countdown > -1) {
                    this.countdown--;
                    if (this.countdown === 0) {
                        this.setNextColor();
                        this.countdown--;
                    }
                }
                if (this.countdown > -1) {
                    return this.countdown;
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

    public get observableNextColor(): Observable<TrafficLightColor> {
        return this.activeLight.pipe(
            map(() => this.nextColor),
        );
    }

    private get nextColor(): TrafficLightColor {
        return this.colorPresets[(this.colorIndex + 1) % this.colorPresets.length];
    }

    public setLightColor(color: TrafficLightColor) {
        switch (color) {
            case TrafficLightColor.RED:
                this.setColorIndex(2);
                break;
            case TrafficLightColor.YELLOW:
                this.setColorIndex(1);
                break;
            case TrafficLightColor.GREEN:
                this.setColorIndex(0);
                break;
        }
    }

    public setNextColor() {
        this.setColorIndex((this.colorIndex + 1) % this.colorPresets.length);
    }

    public setColorToRed() {
        switch (this.calculateChangeTime(TrafficLightColor.RED)) {
            case 1:
                this.addCountdownQueue(3);
                break;
            case 2:
                this.addCountdownQueue([5, 3]);
                break;
        }
    }

    public setColorToGreen() {
        switch (this.calculateChangeTime(TrafficLightColor.GREEN)) {
            case 1:
                this.addCountdownQueue(11);
                break;
        }
    }

    public addCountdownQueue(countdown: number | number[]) {
        if (typeof countdown === 'number') {
            this.changeColorCountdown.push(countdown);
        } else {
            this.changeColorCountdown.push(...countdown);
        }
    }

    private calculateChangeTime(destinationColor: TrafficLightColor): number {
        const destinationIndex = this.colorPresets.findIndex(o => o === destinationColor);
        const diff = destinationIndex - this.colorIndex;
        if (diff < 0) {
            return diff + this.colorPresets.length;
        } else {
            return diff;
        }
    }

    private setColorIndex(index: number) {
        this.colorIndex = index;
        this.activeLightSubject.next(this.colorPresets[index]);
    }

}
