import { TrafficLight } from './TrafficLight';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { auditTime } from 'rxjs/operators';

export class SensorModeController {
    private readonly majorTrafficLight: number[] = [1, 2];
    private readonly minorTrafficLight: number[] = [0, 3];
    private coolDown: boolean = false;
    private timeouts: NodeJS.Timeout[] = [];

    constructor(
        private readonly trafficLights: TrafficLight[],
        irSensors: Array<BehaviorSubject<boolean>>,
    ) {
        for (let i = 0; i < this.trafficLights.length; i++) {
            if (this.majorTrafficLight.indexOf(i) !== -1) {
                this.trafficLights[i].setColorToGreen();
            }
        }
        combineLatest(irSensors).pipe(
            auditTime(2000),
        ).subscribe({
            next: ([irSensor0, irSensor1]) => {
                if (!this.coolDown) {
                    if (irSensor0 || irSensor1) {
                        this.setMinorTrafficLightToGreen();
                    }
                }
            },
        });
    }

    private setMinorTrafficLightToGreen() {
        this.setCoolDown();
        for (let i = 0; i < this.trafficLights.length; i++) {
            if (this.majorTrafficLight.indexOf(i) !== -1) {
                this.trafficLights[i].setColorToRed();
                this.timeouts.push(setTimeout(() => {
                    this.trafficLights[i].setColorToGreen();
                }, 30000));
            }
            if (this.minorTrafficLight.indexOf(i) !== -1) {
                this.trafficLights[i].setColorToGreen();
                this.timeouts.push(setTimeout(() => {
                    this.trafficLights[i].setColorToRed();
                }, 30000));
            }
        }
    }

    public clear() {
        for (const trafficLight of this.trafficLights) {
            trafficLight.reset();
        }
        for (const timeout of this.timeouts) {
            clearTimeout(timeout);
        }
    }

    private setCoolDown() {
        this.coolDown = true;
        setTimeout(() => {
            this.coolDown = false;
        }, 60000);
    }
}
