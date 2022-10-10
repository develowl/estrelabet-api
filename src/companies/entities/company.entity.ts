import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { sanitizeCnpj, sanitizePhone } from '../../helpers'
import { User } from '../../users/entities/user.entity'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    length: 14,
    transformer: {
      to: (value) => value.replace(/\D/g, ''),
      from: (value) => sanitizeCnpj(value)
    }
  })
  cnpj: string

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  email: string

  @Column({
    transformer: {
      to: (value) => value.replace(/\D/g, ''),
      from: (value) => sanitizePhone(value)
    }
  })
  phone: string

  @Column({ unique: true })
  address: string

  @OneToMany(() => User, (user) => user.company, { eager: true })
  users: User[]
}
