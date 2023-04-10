import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Group } from './group.entity';
import { Resource } from './resource.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

// @Unique('shouldBeUnique', ['name', 'ownerId', 'groupId'])
@Entity()
export class Label extends Resource {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => Task, (task) => task.labels)
  tasks: Task[];

  @JoinTable()
  @ManyToOne(() => User, (user) => user.labels)
  owner: User;

  @ManyToOne(() => Group, (group) => group.labels)
  group?: Group;
}
