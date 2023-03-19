import { Injectable } from '@nestjs/common';
import { CreateFreeTimeDto } from './dto/create-free-time.dto';
import { UpdateFreeTimeDto } from './dto/update-free-time.dto';

@Injectable()
export class FreeTimeService {
  create(createFreeTimeDto: CreateFreeTimeDto) {
    return 'This action adds a new freeTime';
  }

  findAll() {
    return `This action returns all freeTime`;
  }

  findOne(id: number) {
    return `This action returns a #${id} freeTime`;
  }

  update(id: number, updateFreeTimeDto: UpdateFreeTimeDto) {
    return `This action updates a #${id} freeTime`;
  }

  remove(id: number) {
    return `This action removes a #${id} freeTime`;
  }

  reset() {
    return `This action resets all freeTime`;
  }
}
