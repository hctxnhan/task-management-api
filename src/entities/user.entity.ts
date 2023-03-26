import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { Group } from './group.entity';
import { Label } from './label.entity';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    select: false,
  })
  password: string;

  @Column()
  email: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfBirth?: Date;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks?: Task[];

  @OneToMany(() => Label, (label) => label.user, {
    cascade: true,
  })
  labels?: Label[];

  @OneToMany(() => Category, (category) => category.user, {
    cascade: true,
  })
  categories?: Category[];

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups?: Group[];

  @OneToMany(() => Group, (group) => group.user, {
    cascade: true,
  })
  ownedGroups?: Group[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks?: Task[];
}
