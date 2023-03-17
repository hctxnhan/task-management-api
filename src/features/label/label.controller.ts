import { CurrentResource } from '@/common/decorators/current-resource.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SetResourceType } from '@/common/decorators/resource-type.decorator';
import { UserOwnResourceGuard } from '@/common/guards/user-own-resource.guard';
import { Label } from '@/entities/label.entity';
import { User } from '@/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { CreateLabelDto } from './dto/create-label.dto';
import { ReturnedLabelDto } from './dto/returned-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelService } from './label.service';
@SetResourceType(Label)
@UseGuards(UserOwnResourceGuard)
@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  async create(
    @Body() createLabelDto: CreateLabelDto,
    @CurrentUser() owner: User,
  ): Promise<ReturnedLabelDto> {
    return new ReturnedLabelDto(
      await this.labelService.create(createLabelDto, owner),
    );
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    const all = await this.labelService.findAll({
      where: { userId: user.id },
    });
    return all.map((label) => new ReturnedLabelDto(label));
  }

  @Get(':id')
  async findOne(@CurrentResource() label: Label): Promise<ReturnedLabelDto> {
    return new ReturnedLabelDto(label);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @CurrentResource() label: Label,
    @Body() updateLabelDto: UpdateLabelDto,
  ) {
    await this.labelService.update(id, updateLabelDto);
    return new ReturnedLabelDto({
      ...label,
      ...updateLabelDto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatusCode.NoContent)
  remove(@Param('id') id: number) {
    return this.labelService.remove(id);
  }
}
