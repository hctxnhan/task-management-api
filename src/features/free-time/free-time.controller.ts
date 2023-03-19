import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FreeTimeService } from './free-time.service';
import { CreateFreeTimeDto } from './dto/create-free-time.dto';
import { UpdateFreeTimeDto } from './dto/update-free-time.dto';
import { UserOwnResourceGuard } from '@/common/guards/user-own-resource.guard';
import { SetResourceType } from '@/common/decorators/resource-type.decorator';
import { FreeTimeBlock } from '@/entities/time-block.entity';

@UseGuards(UserOwnResourceGuard)
@SetResourceType(FreeTimeBlock)
@Controller('free-time')
export class FreeTimeController {
  constructor(private readonly freeTimeService: FreeTimeService) {}

  @Post()
  create(@Body() createFreeTimeDto: CreateFreeTimeDto) {
    return this.freeTimeService.create(createFreeTimeDto);
  }

  @Get()
  findAll() {
    return this.freeTimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freeTimeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreeTimeDto: UpdateFreeTimeDto,
  ) {
    return this.freeTimeService.update(+id, updateFreeTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freeTimeService.remove(+id);
  }
}
