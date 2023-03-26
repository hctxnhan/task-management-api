import { JoinGroupInvitationStatus } from '@/types/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroupJoinInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupId: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: JoinGroupInvitationStatus,
    default: JoinGroupInvitationStatus.PENDING,
  })
  status: JoinGroupInvitationStatus;
}
