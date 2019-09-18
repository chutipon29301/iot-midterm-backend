import { Test, TestingModule } from '@nestjs/testing';
import { TrafficLightService } from './traffic-light.service';

describe('TrafficLightService', () => {
  let service: TrafficLightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficLightService],
    }).compile();

    service = module.get<TrafficLightService>(TrafficLightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
