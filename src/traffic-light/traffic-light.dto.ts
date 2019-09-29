import { TrafficLightColor } from '../classes/TrafficLight';
import { TrafficLightSystemMode } from './traffic-light.service';

export class ChangeTrafficLightDto {
    color: TrafficLightColor;
}

// tslint:disable-next-line: max-classes-per-file
export class ChangeIRStateDto {
    state: string;
}

// tslint:disable-next-line: max-classes-per-file
export class TrafficLightCountdownDto {
    countdown: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ChangeTrafficLightSystemModeDto {
    mode: TrafficLightSystemMode;
}
