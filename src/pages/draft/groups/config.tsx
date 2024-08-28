// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useUnit } from 'effector-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { apiHost } from '@/api_host'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import draftStore from '@/store/draft/draft-store'
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
  const { activeTab, config } = useUnit(draftStore)

  const getDraftByEdition = async (draftEdition: number) => {
    try {
      const response = await fetch(
        apiHost + '/draft_by_edition/' + draftEdition,
        {
          mode: 'cors',
          method: 'GET',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const singleDraft = getDraftByEdition(config.edition)
  if (activeTab === '4') {
    if (
      singleDraft.teamsPerGroup !== null &&
      singleDraft.groupsQuantity !== null
    ) {
      window.alert(
        'O sorteio de grupos para o Draft - Edição ' +
          config.edition +
          '  de ' +
          config.game +
          ' já foi feito. Se houver um outro sorteio, o atual será sobrescrito.',
      )
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    getDraftByEdition(config?.edition)
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
