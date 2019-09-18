import { Test, TestingModule } from '@nestjs/testing';
import { TrafficLightController } from './traffic-light.controller';

describe('TrafficLight Controller', () => {
  let controller: TrafficLightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrafficLightController],
    }).compile();

    controller = module.get<TrafficLightController>(TrafficLightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
