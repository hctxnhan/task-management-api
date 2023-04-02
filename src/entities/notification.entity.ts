import { NotificationType } from '@/types/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resource } from './resource.entity';
import { User } from './user.entity';

@Entity()
export class Notification extends Resource {
  @Column()
  type: NotificationType;

  @Column()
  message: string;

  @Column({
    default: false,
  })
  isRead: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.notifications)
  owner?: User;
}
