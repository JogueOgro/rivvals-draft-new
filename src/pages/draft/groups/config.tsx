import { useUnit } from 'effector-react'
import React, { useEffect } from 'react'
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
import groupsStore from '@/store/groups/groups-store'
import { groupsSettingsUseCase } from '@/useCases/draft/groups-settings.useCase'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type IProps = {
  setActiveView: (v: string) => void
}

const defaultValues = {
  groupsQuantity: undefined,
  teamsPerGroup: undefined,
}

const formSchema = z.object({
  groupsQuantity: z.string().min(1, '* Campo obrigatório'),
  teamsPerGroup: z.string().min(1, '* Campo obrigatório'),
})

export default function GroupsConfig({ setActiveView }: IProps) {
  const { groupsQuantity, teamsPerGroup } = useUnit(groupsStore)
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    form.reset({ groupsQuantity, teamsPerGroup })
  }, [form, groupsQuantity, teamsPerGroup])

  return (
    <div className="w-fit h-fit mt-2 pb-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) => {
            groupsSettingsUseCase.execute(formData)
            setActiveView('2')
          })}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="groupsQuantity"
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormLabel>Quantidade de Grupos *</FormLabel>
                <FormControl>
                  <Input
                    key={name}
                    name={name}
                    placeholder="Digite aqui"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamsPerGroup"
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormLabel>Times por Grupo *</FormLabel>
                <FormControl>
                  <Input
                    key={name}
                    name={name}
                    placeholder="Digite aqui"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            className="mt-8 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600  py-2"
          >
            Gerar grupos
          </Button>
        </form>
      </Form>
    </div>
  )
}
