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
import { Notification } from './notification.entity';

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

  @OneToMany(() => Task, (task) => task.owner)
  tasks?: Task[];

  @OneToMany(() => Label, (label) => label.owner, {
    cascade: true,
  })
  labels?: Label[];

  @OneToMany(() => Category, (category) => category.owner, {
    cascade: true,
  })
  categories?: Category[];

  @ManyToMany(() => Group, (group) => group.members)
  @JoinTable()
  groups?: Group[];

  @OneToMany(() => Group, (group) => group.owner, {
    cascade: true,
  })
  ownedGroups?: Group[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks?: Task[];

  @OneToMany(() => Notification, (notification) => notification.owner)
  notifications?: Notification[];
}
