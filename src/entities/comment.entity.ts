import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Resource } from './resource.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Comment extends Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Task, (task) => task.comments, {
    onDelete: 'CASCADE',
  })
  task?: Task;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.categories)
  owner: User;

  @Column()
  taskId: number;
}
