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
export class Label {
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
}
