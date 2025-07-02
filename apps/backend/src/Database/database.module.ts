import { ConfigModule, ConfigService } from "@nestjs/config";
import path from "node:path";
import databaseConfig from "../../config/configuration";
import { TypeOrmModule } from "@nestjs/typeorm";

export default [
  ConfigModule.forRoot({
    envFilePath: path.resolve(__dirname, `../config/env/.env.${process.env.NODE_ENV || 'development'}`),
    isGlobal: true,
    load: [databaseConfig],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'mysql',
      host: config.get<string>('database.host'),
      port: config.get<number>('database.port'),
      username: config.get<string>('database.username'),
      password: config.get<string>('database.password'),
      database: config.get<string>('database.database'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: config.get<boolean>('database.synchronize'),
    }),
  })
]
