import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Index('notification_id_uindex', ['id'], { unique: true })
@Index('notification_pk', ['id'], { unique: true })
@Entity('notification', { schema: 'public' })
export class NotificationEntity {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column('text', { name: 'subscription' })
  subscription: string;

  @Column('character varying', { name: 'username', length: 50 })
  username: string;

  @ManyToOne(
    () => UserEntity,
    user => user.notifications,
    {
      onDelete: 'SET NULL',
      eager: false,
    },
  )
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;
}

