import { TrafficLightColor } from '../classes/TrafficLight';

export class ChangeTrafficLightDto {
    color: TrafficLightColor;
}

// tslint:disable-next-line: max-classes-per-file
export class ChangeIRStateDto {
    state: number;
}
