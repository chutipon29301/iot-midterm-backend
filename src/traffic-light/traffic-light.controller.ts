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

    @Post('next-color/:index')
    public async nextTrafficLightColor(@Param('index', new ParseIntPipe()) index: number) {
        this.trafficLightService.setNextColorOnIndex(index);
    }

    @Post('change-ir-state/:index')
    public async changeIRState(@Param('index', new ParseIntPipe()) index: number, @Body() body: ChangeIRStateDto) {
        this.trafficLightService.changeIRState(index, body.state);
    }

    // @Post('circulate-to-red/:index')
    // public async circulateTrafficAtIndexToRed(@Param('index', new ParseIntPipe()) index: number) {
    //     this.trafficLightService.circulateToRedLightOnIndex(index);
    // }

    // @Post('set-green-light/:index')
    // public async setGreenTrafficLightColor(@Param('index', new ParseIntPipe()) index: number) {
    //     this.trafficLightService.setGreenLightOnIndex(index);
    // }
}
