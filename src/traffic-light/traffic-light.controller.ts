import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { ChangeTrafficLightDto, ChangeIRStateDto, TrafficLightCountdownDto } from './traffic-light.dto';

@Controller('traffic-light')
export class TrafficLightController {

    constructor(private readonly trafficLightService: TrafficLightService) { }

    @Get('sync')
    public async syncTrafficLightColor() {
        await this.trafficLightService.syncTrafficLightColor();
    }

    @Post('change-light/:index')
    public changeTrafficLightColor(@Param('index', new ParseIntPipe()) index: number, @Body() body: ChangeTrafficLightDto) {
        this.trafficLightService.changeLightColor(index, body.color);
    }

    @Post('next-color/:index')
    public nextTrafficLightColor(@Param('index', new ParseIntPipe()) index: number) {
        this.trafficLightService.setNextColorOnIndex(index);
    }

    @Post('change-ir-state/:index')
    public changeIRState(@Param('index', new ParseIntPipe()) index: number, @Body() body: ChangeIRStateDto) {
        this.trafficLightService.changeIRState(index, +body.state);
    }

    @Post('add-light-countdown/:index')
    public addLightCountdown(@Param('index', new ParseIntPipe()) index: number, @Body() body: TrafficLightCountdownDto) {
        this.trafficLightService.addTrafficLightCountdownOnIndex(index, +body.countdown);
    }

    @Post('set-red/:index')
    public setTrafficLightColorToRed(@Param('index', new ParseIntPipe()) index: number) {
        this.trafficLightService.setTrafficLightColorToRedOnIndex(index);
    }

    @Post('set-green/:index')
    public setTrafficLightColorToGreen(@Param('index', new ParseIntPipe()) index: number) {
        this.trafficLightService.setTrafficLightSetToGreenOnIndex(index);
    }
}
