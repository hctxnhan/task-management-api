import { TaskStatus } from '@/types/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { Label } from './label.entity';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column()
  dueDate: Date;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @JoinTable()
  @ManyToMany(() => Label, (label) => label.tasks)
  labels: Label[];

  @JoinTable()
  @ManyToMany(() => Category, (category) => category.tasks)
  categories: Category[];
}
