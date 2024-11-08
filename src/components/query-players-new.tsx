import { useUnit } from 'effector-react'
import { Loader2, Upload } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import api from '@/clients/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IDraft } from '@/domain/draft.domain'
import { IType } from '@/pages/admin'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'
import { createDraftFromDB } from '@/useCases/draft/create-draft-from-db.useCase'

export default function ModalQueryPlayersNew({ type }: { type: IType }) {
  const { isLoading, openModalDBNew } = useUnit(playerStore)
  const [drafts, setDrafts] = useState([])
  const [selectedDraft, setSelectedDraft] = useState('')
  const route = useRouter()

  const fetchActiveDrafts = async () => {
    try {
      const response = await api.get('/unique_active_drafts')
      const data = response.data
      setDrafts(data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }
  }

  const onSubmit = (draftEdition?: string | null) => {
    if (!draftEdition) return
    playerEvent({ isLoading: true })
    createDraftFromDB.execute({
      draftEdition,
      type,
      callBack: () => {
        route.push('/draft')
      },
    })
  }

  useEffect(() => {
    playerEvent({ isLoading: false })
    fetchActiveDrafts()
  }, [openModalDBNew])

  return (
    <Dialog
      open={openModalDBNew}
      onOpenChange={(v) => playerEvent({ openModalDBNew: v })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Iniciar novo draft</DialogTitle>
          <div>
            <div
              className={`flex flex-col items-center justify-center border-2 rounded-lg py-6 mt-6 'bg-blue-100 border-solid' : 'border-dashed'}`}
            >
              <Select value={selectedDraft} onValueChange={setSelectedDraft}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="-Selecione-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {drafts?.map((draft: IDraft) => (
                      <SelectItem
                        key={draft?.edition?.toString()}
                        value={draft?.edition?.toString()}
                      >
                        {'Draft ' +
                          draft.game +
                          ' ' +
                          draft.edition +
                          ' edição'}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="mt-4">
                <Button
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  onClick={() => onSubmit(selectedDraft)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-7 w-7 animate-spin" />
                      <span className="text-md ml-2">Iniciando...</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        <span>Draftar!</span>
                      </div>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
