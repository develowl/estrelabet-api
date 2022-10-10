import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from '../../companies/entities/company.entity'
import { sanitizeCPF } from '../../helpers'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    length: 11,
    transformer: {
      to: (value: string) => value.replace(/\D/g, ''),
      from: (value: string) => sanitizeCPF(value)
    }
  })
  cpf: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  address: string

  @ManyToOne(() => Company, (company) => company.id, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_company' })
  company: Company
}
