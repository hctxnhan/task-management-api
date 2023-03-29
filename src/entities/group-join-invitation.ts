import { JoinGroupInvitationStatus } from '@/types/enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { Resource } from './resource.entity';
import { User } from './user.entity';

@Entity()
export class GroupJoinInvitation extends Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: JoinGroupInvitationStatus,
    default: JoinGroupInvitationStatus.PENDING,
  })
  status: JoinGroupInvitationStatus;

  @ManyToOne(() => Group, (group) => group.tasks)
  group?: Group;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.tasks)
  owner: User;
}
