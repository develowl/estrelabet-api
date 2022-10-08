import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, length: 14 })
  cnpj: string

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  phone: string

  @Column({ unique: true })
  address: string
}
