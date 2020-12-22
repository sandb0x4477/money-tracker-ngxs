import { Column, Entity, Index, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { NotificationEntity } from '../notification/notification.entity';

@Index('user_email_uindex', ['email'], { unique: true })
@Index('user_id_uindex', ['id'], { unique: true })
@Index('user_pk', ['id'], { unique: true })
@Entity('user', { schema: 'public' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id' })
  id: number;

  @Column('character varying', { name: 'username', length: 50 })
  username: string;

  @Column('text', { name: 'email' })
  email: string;

  @Column('text', { name: 'password' })
  password: string;

  @OneToMany(
    () => NotificationEntity,
    notification => notification.user,
  )
  notifications: NotificationEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  userToReturn() {
    const { username, email } = this;

    const responseObj = {
      username,
      email,
      token: this.token,
    };

    return responseObj;
  }

  // ? TOKEN
  private get token(): string {
    const { id, username, email } = this;

    return jwt.sign(
      {
        id,
        username,
        email,
      },
      process.env.SECRET,
      { expiresIn: '31d' },
    );
  }
}
