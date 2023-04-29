import { TaskPriority, TaskStatus } from '@/types/enum';
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
import { Resource } from './resource.entity';
import { User } from './user.entity';

@Entity()
export class Task extends Resource {
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
  @ManyToMany(() => Label, (label) => label.tasks, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  labels?: Label[];

  @ManyToOne(() => Category, (category) => category.tasks, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  category?: Category;

  @Column()
  categoryId: number;

  @ManyToOne(() => User, (user) => user.assignedTasks)
  assignee?: User;

  @ManyToOne(() => Group, (group) => group.tasks, {
    onDelete: 'CASCADE',
  })
  group?: Group;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.tasks)
  owner: User;
}
