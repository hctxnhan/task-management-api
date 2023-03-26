import { TaskPriority, TaskStatus } from '@/types/enum';
import { IUserOwnResource } from '@/types/user-own-resource.interface';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Group } from './group.entity';
import { Label } from './label.entity';
import { User } from './user.entity';

@Entity()
export class Task implements IUserOwnResource {
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

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NONE,
  })
  priority: TaskPriority;

  @Column({
    default: 1,
  })
  duration: number;

  @Column()
  dueDate: Date;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.tasks)
  user?: User;

  @Column()
  userId: number;

  @JoinTable()
  @ManyToMany(() => Label, (label) => label.tasks, {
    eager: true,
  })
  labels?: Label[];

  @ManyToOne(() => Category, (category) => category.tasks, {
    eager: true,
  })
  category?: Category;

  @Column()
  categoryId: number;

  @ManyToOne(() => User, (user) => user.assignedTasks)
  assignee?: User;

  @ManyToOne(() => Group, (group) => group.tasks)
  group?: Group;
}
