import { IUserOwnResource } from '@/types/user-own-resource.interface';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Label implements IUserOwnResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => Task, (task) => task.labels)
  tasks: Task[];

  @JoinTable()
  @ManyToOne(() => User, (user) => user.labels)
  user: User;

  @Column()
  userId: number;
}
