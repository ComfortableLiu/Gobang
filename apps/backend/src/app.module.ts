import { Module } from '@nestjs/common';
import { UserModule } from "./api/User/user.module";
import DatabasesModule from "./database/database.module";

@Module({
  imports: [
    ...DatabasesModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
}
