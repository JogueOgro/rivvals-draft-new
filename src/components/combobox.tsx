'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type IProps = {
  data: {
    value: string | number
    name: string
  }[]
  value?: string | null
  setValue: (v: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ComboboxInput(props: IProps) {
  const [open, setOpen] = React.useState(false)

  const placeholder = props?.placeholder || 'Selecione'
  const selectedItem = props?.data?.find(
    (item: any) => item?.value === props?.value,
  )

  return (
    <div className="flex flex-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={props?.disabled}
            className="w-full justify-between font-light"
          >
            {props?.value ? selectedItem?.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Pesquisar..." />
            <CommandEmpty>Sem resultados.</CommandEmpty>
            <CommandGroup>
              {props?.data?.map((item: any) => (
                <CommandItem
                  key={item?.value}
                  value={item?.value}
                  onSelect={(currentValue) => {
                    props?.setValue(
                      currentValue === props?.value ? '' : currentValue,
                    )
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      props?.value === item?.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {item?.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
