import { sanitizeCnpj } from 'src/helpers'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    length: 14,
    transformer: {
      to: (value: string) => value.replace(/\D/g, ''),
      from: (value: string) => sanitizeCnpj(value)
    }
  })
  cnpj: string

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  phone: string

  @Column({ unique: true })
  address: string

  sanitizeCnpj(value: string) {
    return value
      .replace(/\D/i, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
  }
}
