import { TaskStatus } from '@/types/enum';
import { IUserOwnResource } from '@/types/user-own-resource.interface';
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

  @JoinTable()
  @ManyToMany(() => Category, (category) => category.tasks, {
    eager: true,
  })
  categories?: Category[];
}
