import { FilterX, Search } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { playerEvent } from '@/store/player/player-events'
import { changeFiltersUseCase } from '@/useCases/player/change-filters.useCase'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const defaultValues = {
  name: null,
}

const formSchema = z.object({
  name: z.string().nullable().nullish(),
})

export default function TableFilters() {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    form.reset({})
  }, [form])

  return (
    <div className="w-full my-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(changeFiltersUseCase.execute)}
          className="flex items-center mt-2 gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            defaultValue=""
            render={({ field: { value, onChange, name } }) => (
              <FormItem className="min-w-80">
                <FormControl>
                  <Input
                    key={name}
                    name={name}
                    placeholder="Pesquisar por nome"
                    value={value?.toString()}
                    onChange={(event) => onChange(event.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            onClick={(event) => {
              event.stopPropagation()
              event.preventDefault()
              playerEvent({ filters: { name: null } })
              form.reset({ name: '' })
            }}
          >
            <FilterX className="w-5 h-5" />
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600  py-2"
          >
            <Search className="w-5 h-5" />
          </Button>
        </form>
      </Form>
    </div>
  )
}
