import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { Resource } from './resource.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Category extends Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: 1,
  })
  priority: number;

  @OneToMany(() => Task, (task) => task.category)
  tasks?: Task[];

  @ManyToOne(() => Group, (group) => group.categories, {
    onDelete: 'CASCADE',
  })
  group?: Group;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.categories)
  owner: User;
}
