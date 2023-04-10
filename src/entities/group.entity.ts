import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Label } from './label.entity';
import { Resource } from './resource.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Group extends Resource {
  @ManyToMany(() => User, (user) => user.groups)
  members: User[];

  @ManyToOne(() => User, (user) => user.ownedGroups)
  owner: User;

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
