/* eslint-disable jsx-a11y/alt-text */
import { Image, MoreVerticalIcon, Trash } from 'lucide-react'
import React, { useRef } from 'react'

import { IPlayer } from '@/domain/player.domain'
import { playerEvent } from '@/store/player/player-events'
import { deletePlayersUseCase } from '@/useCases/player/delete-player.useCase'

import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const PlayerActions = ({
  row,
  data,
}: {
  data: IPlayer[]
  row: { original: IPlayer }
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    playerId: string,
  ) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      // Check file size
      if (file.size > 400 * 1024) {
        window.alert(
          'O arquivo é muito grande. Por favor, selecione um arquivo menor que 400KB.',
        )
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const base64Image = reader.result as string
        const newData = data.map((player) =>
          player.id === playerId ? { ...player, photo: base64Image } : player,
        )
        playerEvent({ players: newData })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error:', error)
      window.alert(
        'Ocorreu um erro ao processar o arquivo. Por favor, tente novamente.',
      )
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/jpeg, image/webp"
        onChange={(e) => handleFileChange(e, row.original.id!)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVerticalIcon className="text-zinc-500 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleFileSelect}>
            <Image className="w-5 text-blue-700" />
            <span className="pl-2">Atualizar foto</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deletePlayersUseCase.execute([row.original.id!])}
          >
            <Trash className="w-5 text-red-600" />
            <span className="pl-2">Excluir player</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default PlayerActions
