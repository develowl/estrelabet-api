import { BadRequestException } from '@nestjs/common'
import fetch from 'node-fetch'
import { AddressDto } from '../common/dtos/address.dto'

export const sanitizeCnpj = (cnpj: string) => {
  return cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
}

export const sanitizeCPF = (cpf: string) => {
  return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
}

export const sanitizeCep = (cep: string) => {
  return cep.replace(/\D/g, '')
}

export const fetchAddress = async ({ cep, num }: AddressDto) => {
  const url = process.env.CEP_API ?? 'https://viacep.com.br/ws'
  const sanitizedCep = sanitizeCep(cep)
  const cepApi = `${url}/${sanitizedCep}/json`
  return await fetch(cepApi)
    .then((data) => data.json())
    .then((data) => {
      if (data?.erro) throw new BadRequestException('Address not found')

      const { logradouro, complemento, bairro, localidade, uf, cep } = data

      return `${logradouro}, ${num},${
        complemento ? `${complemento},` : ''
      } ${bairro}, ${localidade} - ${uf}, ${cep}`
    })
}
