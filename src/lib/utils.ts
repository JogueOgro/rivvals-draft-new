/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/* eslint-disable prettier/prettier */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomPosition = (
  index: number,
  width: number,
  height: number,
) => {
  const minMargin = 28
  const heightCalc = height / 1.5 - minMargin
  const widthCalc = width / 1.5 - minMargin
  let top, left
  if (index % 4 === 0) {
    top = `${Math.random() * heightCalc + minMargin}px`
    left = `${Math.random() * widthCalc + minMargin}px`
  } else if (index % 4 === 1) {
    top = `${Math.random() * heightCalc + minMargin}px`
    left = `${Math.random() * widthCalc + width / 2}px`
  } else if (index % 4 === 2) {
    top = `${Math.random() * heightCalc + height / 2}px`
    left = `${Math.random() * widthCalc + minMargin}px`
  } else {
    top = `${Math.random() * heightCalc + height / 2}px`
    left = `${Math.random() * widthCalc + width / 2}px`
  }
  return { top, left }
}

export const randomSize = () => ({
  maxWidth: `${Math.floor(Math.random() * (100 - 50 + 1)) + 50}px`,
})

export const emailRegexPattern =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

export const sleep = async (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const maskCnpj = (cnpj: string) => {
  if (!cnpj || cnpj === '') return cnpj
  return cnpj
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const maskPhone = (value: string) => {
  let str = value
  str = str?.replace(/\D/g, '')
  str = str?.replace(/^(\d{2})(\d)/g, '($1) $2')
  str = str?.replace(/(\d)(\d{4})$/, '$1-$2')
  return str
}

export const maskCpf = (cpf: string) => {
  const num = cpf?.replace(/\D/g, '')
  const len = num?.length
  let str = ''
  if (len) {
    if (len <= 6) {
      str = num?.replace(/(\d{3})(\d{1,3})/g, '$1.$2')
    }
    if (len <= 9) {
      str = num?.replace(/(\d{3})(\d{3})(\d{1,3})/g, '$1.$2.$3')
    }
    str = num?.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/g, '$1.$2.$3-$4')
  }
  return str
}

export const maskCep = (value?: string) => {
  let str = value
  str = str?.replace(/\D/g, '')
  str = str?.replace(/^(\d{5})(\d)/, '$1-$2')
  return str
}

export function maskReverseCEP(cep: string) {
  return cep?.replace('.', '')?.replace('-', '')
}

export const maskMoneyReverse = (value: string | number) => {
  if (!value) return 0
  const v = value?.toString()
  const remodeDolar = v?.replace('R$ ', '')
  const removeDots = remodeDolar?.replace('.', '')
  const fixCommaDots = removeDots?.replace(',', '.')
  const num = Number(fixCommaDots)
  return num
}

export const maskMoney = (value: number | string) => {
  if (!value) return ''
  let v = value?.toString()
  v = v.replace(/\D/g, '')
  v = v.replace(/(\d{1,2})$/, ',$1')
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  v = v !== '' ? v : ''
  return v
}

export const reverseCNPJMask = (value: string) => {
  if (!value) return ''
  const v = value.replace(/[^\d]/g, '')
  return v
}

export const reverseCPFMask = (cpf: string) => cpf?.replace(/[.-]/g, '')

export const cnpjValidator = (cnpj?: string): boolean => {
  if (!cnpj) return false
  const sanitizedCnpj = cnpj.replace(/[^\d]+/g, '')

  if (sanitizedCnpj === '') {
    return false
  }

  if (sanitizedCnpj.length !== 14) {
    return false
  }

  const knownInvalidCnpjs = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999',
  ]

  if (knownInvalidCnpjs.includes(sanitizedCnpj)) {
    return false
  }

  const calculateDigit = (nums: string, tm: number): number => {
    let sum = 0
    let posi = tm - 7

    for (let i = tm; i >= 1; i--) {
      sum += Number(nums.charAt(tm - i)) * posi--

      if (posi < 2) {
        posi = 9
      }
    }

    return sum % 11 < 2 ? 0 : 11 - (sum % 11)
  }

  const digits = sanitizedCnpj.substring(sanitizedCnpj.length - 2)
  const nums = sanitizedCnpj.substring(0, sanitizedCnpj.length - 2)

  const firstDigit = calculateDigit(nums, nums.length)
  if (firstDigit !== Number(digits.charAt(0))) {
    return false
  }

  const secondDigit = calculateDigit(nums + firstDigit, nums.length + 1)
  if (secondDigit !== Number(digits.charAt(1))) {
    return false
  }

  return true
}

export const cpfValidator = (cpf: string) => {
  if (!cpf) {
    return false
  }

  let cpfSum = 0
  const strCPF = cpf.replace('.', '').replace('.', '').replace('-', '')

  if (
    strCPF === '00000000000' ||
    strCPF === '11111111111' ||
    strCPF === '22222222222' ||
    strCPF === '33333333333' ||
    strCPF === '44444444444' ||
    strCPF === '55555555555' ||
    strCPF === '66666666666' ||
    strCPF === '77777777777' ||
    strCPF === '88888888888' ||
    strCPF === '99999999999' ||
    strCPF.length !== 11
  )
    return false

  for (let i = 1; i <= 9; i++) {
    cpfSum += parseInt(strCPF.substring(i - 1, i), 10) * (11 - i)
  }

  let cpfRest = (cpfSum * 10) % 11
  if (cpfRest === 10 || cpfRest === 11) cpfRest = 0

  if (cpfRest !== parseInt(strCPF.substring(9, 10), 10)) return false

  cpfSum = 0
  for (let k = 1; k <= 10; k++) {
    cpfSum += parseInt(strCPF.substring(k - 1, k), 10) * (12 - k)
  }

  cpfRest = (cpfSum * 10) % 11
  if (cpfRest === 10 || cpfRest === 11) cpfRest = 0

  if (cpfRest !== parseInt(strCPF.substring(10, 11), 10)) return false

  return true
}

export function dataURLtoFile(dataURL?: string): File | '' {
  if (!dataURL) return ''

  const arr = dataURL?.split(',')
  const mime = arr?.[0]?.match(/:(.*?);/)?.[1]
  const bstr = atob(arr?.[1] || '')
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  const fileType = mime?.toString() || 'application/octet-stream'

  return new File([u8arr], 'filename', { type: fileType }) as any
}

export const stringTruncate = (text: string, limit: number) => {
  if (!text) return ''
  let str = text
  if (text.length > limit) {
    str = str.substring(0, limit) + '...'
  }
  return str
}

export const getFileSize = (fileSize: number, decimals: number) => {
  const bytes = fileSize
  if (bytes <= 0) return '0 B'
  const suffixes: string[] = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB',
  ]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${suffixes[i]}`
}

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop() || ''
}

export const formatFileName = (file: File): string => {
  const timestamp = Date.now()
  const fileName = file.name
  const extension = getFileExtension(fileName)
  const [name] = fileName.split('.')
  const formattedName = name.replaceAll(' ', '_')
  return `${formattedName}_${timestamp}.${extension}`
}

export const weekDays = [
  'SEGUNDA-FEIRA',
  'TERÇA-FEIRA',
  'QUARTA-FEIRA',
  'QUINTA-FEIRA',
  'SEXTA-FEIRA',
]

export const sortDays = (a, b) => {
  const indexA = weekDays.indexOf(a.day)
  const indexB = weekDays.indexOf(b.day)
  if (indexA === indexB) {
    return a.hour - b.hour
  } else {
    return indexA - indexB
  }
}

export const fixStringToObj = (string) => {
  try {
    const formattedString = string
      .replace(/'/g, '"')
      .replace(/True/g, 'true')
      .replace(/False/g, 'false')

    return JSON.parse(formattedString)
  } catch (error) {
    console.error('Erro ao converter string para objeto JSON:', error)
    return null
  }
}

export const formatLocalDate = (date) => {
  const localDate = new Date(date)
    .toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(',', '')
    .replace('/', '-')
    .replace('/', '-')
    .replace(' ', 'T')

  return localDate
}
