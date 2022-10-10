import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from '../../companies/entities/company.entity'
import { sanitizeCPF, sanitizePhone } from '../../helpers'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    length: 11,
    transformer: {
      to: (value) => value.replace(/\D/g, ''),
      from: (value) => sanitizeCPF(value)
    }
  })
  cpf: string

  @Column()
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

  @Column()
  address: string

  @ManyToOne(() => Company, (company) => company.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_company' })
  company: Company
}
