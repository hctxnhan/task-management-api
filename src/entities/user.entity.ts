import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

  @Column()
  dateOfBirth: Date;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Label, (label) => label.user)
  labels: Label[];

  @OneToMany(() => Label, (category) => category.user)
  categories: Label[];
}
