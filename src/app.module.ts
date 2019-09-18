import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config/config.service';
@Module({
  imports: [ConfigModule, MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      uri: configService.mongodbConnectionString,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
