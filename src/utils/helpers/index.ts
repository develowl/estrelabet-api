import { AddressDto } from '../dto/address.dto'

export const fetchAddress = async ({ cep, num }: AddressDto) => {
  const url = process.env.CEP_API ?? 'https://viacep.com.br/ws'
  const cepApi = `${url}/${cep}/json`
  return await fetch(cepApi)
    .then((data) => data.json())
    .then(({ logradouro, complemento, bairro, localidade, uf, cep }) => {
      return `${logradouro}, ${num},${
        complemento ? `${complemento},` : ''
      } ${bairro}, ${localidade} - ${uf}, ${cep}`
    })
}
