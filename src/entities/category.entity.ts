import { IUserOwnResource } from '@/types/user-own-resource.interface';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Category implements IUserOwnResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Task, (task) => task.categories)
  tasks: Task[];

  @JoinTable()
  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @Column()
  userId: number;
}
