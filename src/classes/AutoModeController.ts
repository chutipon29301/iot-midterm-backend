import { TrafficLight } from './TrafficLight';
import { Observable } from 'rxjs';

export class AutoModeController {
    private lightTimeouts: number[] = [30, 30, 30, 30];
    private index: number = 0;
    private counter: number = 0;

    constructor(private readonly trafficLights: TrafficLight[], interval: Observable<number>) {
        trafficLights[this.index].setColorToGreen();
        interval.subscribe({
            next: () => {
                this.counter++;
                if (this.counter === this.lightTimeouts[this.index]) {
                    this.counter = 0;
                    trafficLights[this.index].setColorToRed();
                    this.index = (this.index + 1) % this.lightTimeouts.length;
                    trafficLights[this.index].setColorToGreen();
                }
            },
        });
    }
}
