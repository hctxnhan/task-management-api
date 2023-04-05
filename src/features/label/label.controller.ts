import {
  SetAuthorization,
  SetResourceType,
} from '@/common/decorators/authorization.decorator';
import { CurrentResource } from '@/common/decorators/current-resource.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Label } from '@/entities/label.entity';
import { User } from '@/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsNull } from 'typeorm';
import { Permission } from '../authorization/permission.type';
import { ResourceType } from '../authorization/resource-type.type';
import { CreateLabelDto } from './dto/create-label.dto';
import { ReturnedLabelDto } from './dto/returned-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelService } from './label.service';

@ApiBearerAuth()
@ApiTags('Label')
@Controller('label')
@SetResourceType(ResourceType.LABEL)
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @SetAuthorization(Permission.CREATE)
  @Post()
  async create(
    @Body() createLabelDto: CreateLabelDto,
    @CurrentUser() owner: User,
  ): Promise<ReturnedLabelDto> {
    return new ReturnedLabelDto(
      await this.labelService.create(createLabelDto, owner),
    );
  }

  @SetAuthorization(Permission.READ)
  @Get()
  async findAll(@CurrentUser() user: User) {
    const all = await this.labelService.findAll({
      where: { ownerId: user.id, groupId: IsNull() },
    });
    return all.map((label) => new ReturnedLabelDto(label));
  }

  @SetAuthorization(Permission.READ)
  @Get(':id')
  async findOne(@CurrentResource() label: Label): Promise<ReturnedLabelDto> {
    return new ReturnedLabelDto(label);
  }

  @SetAuthorization(Permission.UPDATE)
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

  @SetAuthorization(Permission.DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.labelService.remove(id);
  }
}
