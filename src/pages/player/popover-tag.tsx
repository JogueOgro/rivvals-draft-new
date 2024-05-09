import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

type IProps = {
  playerId?: string
}

export function PopoverTag({ playerId }: IProps) {
  const [name, setName] = useState('')

  const onSaveTag = () => {
    const { players: oldList } = playerStore.getState()

    const newList = [...oldList].map((player) => {
      if (player.id !== playerId) return player
      return {
        ...player,
        tags: `${player.tags},${name}`,
      }
    })

    playerEvent({ players: newList })
    setName('')
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Badge variant="secondary" className="w-fit cursor-pointer">
            <Plus className="w-3 h-3" />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Adicionar Tag</h4>
            <p className="text-sm text-muted-foreground">
              Tags são utilizadas para evitar que alguns jogadores caiam no
              mesmo time
            </p>
          </div>
          <div className="grid gap-2">
            <div className="w-full flex items-center gap-2">
              <Label htmlFor="tagName">Nome: </Label>
              <Input
                name="tagName"
                id="tagName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                defaultValue=""
                className="col-span-2 h-8"
                placeholder="Digite aqui"
              />
            </div>
            <div className="w-full flex justify-end mt-4" onClick={onSaveTag}>
              <Button
                disabled={!name}
                className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 "
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
