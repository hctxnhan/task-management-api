import { IUserOwnResource } from '@/types/user-own-resource.interface';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Category implements IUserOwnResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.category)
  tasks?: Task[];

  @JoinTable()
  @ManyToOne(() => User, (user) => user.categories)
  user?: User;

  @Column()
  userId: number;
}
