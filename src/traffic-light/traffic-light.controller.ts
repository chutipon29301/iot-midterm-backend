import { Controller, Get } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';

@Controller('traffic-light')
export class TrafficLightController {

    constructor(private readonly trafficLightService: TrafficLightService) { }

    @Get('/ping-mqtt')
    public async sendPingMqttMessage() {
        await this.trafficLightService.sendPingMqttMessage();
    }
}
