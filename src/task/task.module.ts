import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'nestjs-prisma';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlacklistService } from 'src/auth/blacklist';

@Module({
  imports: [PrismaModule],
  providers: [TaskService, AuthGuard, BlacklistService],
  controllers: [TaskController],
})
export class TaskModule {}
