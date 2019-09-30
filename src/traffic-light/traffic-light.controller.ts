import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { ChangeTrafficLightDto, ChangeIRStateDto, TrafficLightCountdownDto, ChangeTrafficLightSystemModeDto } from './traffic-light.dto';

@Controller('traffic-light')
export class TrafficLightController {

    constructor(private readonly trafficLightService: TrafficLightService) { }

    @Get('sync')
    public async syncTrafficLightColor() {
        await this.trafficLightService.syncTrafficLightColor();
    }

    @Post('mode')
    public setTrafficLightMode(@Body() body: ChangeTrafficLightSystemModeDto) {
        this.trafficLightService.setTrafficLightSystemMode(body.mode);
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
        const status = +body.state;
        if (status === 0) {
            this.trafficLightService.changeIRState(index, 1);
        } else {
            this.trafficLightService.changeIRState(index, 0);
        }
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
