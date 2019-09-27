import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { ChangeTrafficLightDto, ChangeIRStateDto } from './traffic-light.dto';

@Controller('traffic-light')
export class TrafficLightController {

    constructor(private readonly trafficLightService: TrafficLightService) { }

    @Get('sync')
    public async syncTrafficLightColor() {
        await this.trafficLightService.syncTrafficLightColor();
    }

    @Post('change-light/:index')
    public async changeTrafficLightColor(@Param('index', new ParseIntPipe()) index: number, @Body() body: ChangeTrafficLightDto) {
        this.trafficLightService.changeLightColor(index, body.color);
    }


    @Post('change-ir-state/:index')
    public async changeIRState(@Param('index', new ParseIntPipe()) index: number, @Body() body: ChangeIRStateDto) {
        this.trafficLightService.changeIRState(index, body.state);
    }

    @Get('ping-mqtt')
    public async sendPingMqttMessage() {
        await this.trafficLightService.sendPingMqttMessage();
    }
}
