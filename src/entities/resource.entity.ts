import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @Column({
    nullable: true,
  })
  groupId?: number;
}
