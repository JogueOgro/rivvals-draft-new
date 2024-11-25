// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Check, ListRestart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { IMatch } from '@/domain/match.domain'
import { postMatchUseCase } from '@/useCases/match/post-match.useCase'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const defaultValues = {
  team1: '',
  team2: '',
}

const formSchema = z.object({
  team1: z
    .string()
    .min(1, '* Campo obrigatório')
    .refine((val) => Number.isInteger(parseInt(val)), {
      message: '* O valor deve ser um número inteiro',
    })
    .transform((val) => parseInt(val)),
  team2: z
    .string()
    .min(1, '* Campo obrigatório')
    .refine((val) => Number.isInteger(parseInt(val)), {
      message: '* O valor deve ser um número inteiro',
    })
    .transform((val) => parseInt(val)),
})

export default function MatchesConfig({ match, index }: IMatch) {
  const [sent, setSent] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {}, [])

  const handleClick = () => {
    setSent(false)
    form.reset({
      team1: '',
      team2: '',
    })
  }

  return (
    <div className="w-fit h-fit mt-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) => {
            if (!formData || !formData.team1 || !formData.team2) {
              alert('Preencha todos os campos.')
              return
            }
            setSent(true)
            formData = { ...formData, match }
            postMatchUseCase.execute(formData)
          })}
          className="flex items-center gap-4"
        >
          <div
            key={index}
            className={`flex items-center gap-4 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-gray-100'}`}
          >
            <FormField
              control={form.control}
              name="team1"
              render={({ field: { value, onChange, name } }) => (
                <FormItem className="flex items-center gap-2 mb-2">
                  <FormLabel className="flex justify-end w-[200px] mt-2">
                    <strong
                      className={`flex items-center gap-1 text-left mb-2 mt-2  ${sent ? 'text-gray-400' : ''}`}
                    >
                      <span className="truncate">
                        {match.team1?.name || 'N/A'}
                      </span>
                      <span>({match.team1?.number || 'N/A'})</span>
                    </strong>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={sent}
                      key={name}
                      name={name}
                      placeholder=""
                      value={value}
                      onChange={(event) => onChange(event.target.value)}
                      className="w-[50px] text-center"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <span
              className={`text-xl font-bold ${sent ? 'text-gray-400' : ''}`}
            >
              vs
            </span>

            <FormField
              control={form.control}
              name="team2"
              render={({ field: { value, onChange, name } }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      disabled={sent}
                      key={name}
                      name={name}
                      placeholder=""
                      value={value}
                      onChange={(event) => onChange(event.target.value)}
                      className="w-[50px] text-center"
                    />
                  </FormControl>
                  <FormLabel className="flex justify-start w-[200px]">
                    <strong
                      className={`flex items-center gap-1 text-left mb-2  ${sent ? 'text-gray-400' : ''}`}
                    >
                      <span className="truncate">
                        {match.team2?.name || 'N/A'}
                      </span>
                      <span>({match.team2?.number || 'N/A'})</span>
                    </strong>
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          {!sent ? (
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
            >
              <Check />
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400"
                    onClick={() => {
                      handleClick()
                    }}
                  >
                    <ListRestart />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </form>
      </Form>
    </div>
  )
}
