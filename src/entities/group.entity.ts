import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Label } from './label.entity';
import { Resource } from './resource.entity';
import { Task } from './task.entity';
import { User } from './user.entity';
import { GroupJoinInvitation } from './group-join-invitation';

@Entity()
export class Group extends Resource {
  @ManyToMany(() => User, (user) => user.groups)
  members: User[];

  @ManyToOne(() => User, (user) => user.ownedGroups)
  owner: User;

  @OneToMany(() => Category, (category) => category.group)
  categories: Category[];

  @OneToMany(() => Label, (label) => label)
  labels: Label[];

  @OneToMany(() => Task, (task) => task.group)
  tasks: Task[];

  @Column()
  name: string;

  @OneToMany(() => GroupJoinInvitation, (invitation) => invitation.group)
  joinInvitations: GroupJoinInvitation[];
}
