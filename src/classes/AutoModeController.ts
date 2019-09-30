import { TrafficLight } from './TrafficLight';
import { Observable, Subscriber, Subscription } from 'rxjs';

export class AutoModeController {
    private lightTimeouts: number[] = [30, 30, 30, 30];
    private index: number = 0;
    private counter: number = 0;
    private subscription: Subscription = null;

    constructor(private readonly trafficLights: TrafficLight[], interval: Observable<number>) {
        trafficLights[this.index].setColorToGreen();
        this.subscription = interval.subscribe({
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

    public clear() {
        this.subscription.unsubscribe();
        for (const trafficLight of this.trafficLights) {
            trafficLight.reset();
        }
    }
}
