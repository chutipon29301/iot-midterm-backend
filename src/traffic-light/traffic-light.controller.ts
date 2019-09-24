import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { ChangeTrafficLightDto } from './traffic-light.dto';

@Controller('traffic-light')
export class TrafficLightController {

    constructor(private readonly trafficLightService: TrafficLightService) { }

    @Get('sync')
    public async syncTrafficLightColor() {
        await this.trafficLightService.syncTrafficLightColor();
        return { msg: 'OK' };
    }

    @Post('change-light/:index')
    public async changeTrafficLightColor(@Param('index', new ParseIntPipe()) index: number, @Body() body: ChangeTrafficLightDto) {
        this.trafficLightService.changeLightColor(index, body.color);
    }

    @Get('ping-mqtt')
    public async sendPingMqttMessage() {
        await this.trafficLightService.sendPingMqttMessage();
    }
}
