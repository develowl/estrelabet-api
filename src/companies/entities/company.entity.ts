import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, length: 14 })
  cnpj: string

  @Column({ unique: true })
  name: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  address: string
}
