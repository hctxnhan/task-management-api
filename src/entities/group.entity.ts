import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Label } from './label.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @ManyToOne(() => User, (user) => user.ownedGroups)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Category, (category) => category.group, {
    cascade: true,
  })
  categories: Category[];

  @OneToMany(() => Label, (label) => label, {
    cascade: true,
  })
  labels: Label[];

  @OneToMany(() => Task, (task) => task.group, {
    cascade: true,
  })
  tasks: Task[];

  @Column()
  name: string;
}
