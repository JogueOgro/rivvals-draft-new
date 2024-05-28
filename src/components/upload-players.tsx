import { useStore } from 'effector-react'
import { Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import excelImg from '@/assets/excel.webp'
import uploadImg from '@/assets/upload.webp'
import { AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { getFileSize, stringTruncate } from '@/lib/utils'
import { IType } from '@/pages/home'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'
import { readUploadFileUseCase } from '@/useCases/draft/read-upload-file.useCase'

export default function ModalUploadPlayers({ type }: { type: IType }) {
  const { progress, isLoading, openModalUpload } = useStore(playerStore)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  const route = useRouter()

  const onSubmit = (file?: File | null) => {
    if (!file) return
    readUploadFileUseCase.execute({
      file,
      type,
      callBack: () => {
        route.push(type === 'import' ? '/draft' : '/player')
      },
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
    if (file) onSubmit(file)
  }

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    setSelectedFile(file || null)
    setIsDragging(false)
  }

  const onReset = () => {
    playerEvent({ progress: 0 })
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    setSelectedFile(null)
    playerEvent({ progress: 0 })
  }, [openModalUpload])

  return (
    <Dialog
      open={openModalUpload}
      onOpenChange={(v) => playerEvent({ openModalUpload: v })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importação de jogadores</DialogTitle>
          <div>
            <div
              className={`flex flex-col items-center justify-center border-2 rounded-lg py-6 mt-6 ${isDragging ? 'bg-blue-100 border-solid' : 'border-dashed'}`}
              onClick={handleClickUpload}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              ref={dropAreaRef}
            >
              <Image
                src={uploadImg}
                alt="Upload"
                width={150}
                height={150}
                className="self-center"
              />
              <span className="text-md font-semibold mt-4">
                Arraste e solte seu arquivo aqui
              </span>
              <Button variant="ghost" className="text-blue-600">
                Escolher arquivo
              </Button>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                ref={fileInputRef}
              />
            </div>
            <div className="w-full flex items-center justify-between mt-2">
              <span className="font-light text-sm text-zinc-400">
                Formatos suportados: XLSX
              </span>
              <span className="font-light text-sm text-zinc-400">
                Tamanho máximo: 10mb
              </span>
            </div>

            {selectedFile && (
              <div className="w-full mt-6">
                <div className="flex items-center justify-between border rounded-xl py-4 px-2 w-full">
                  <div className="w-full flex items-center gap-4 pl-2">
                    <Image src={excelImg} alt="Excel" width={30} height={30} />
                    <div className="flex flex-col w-full">
                      <span className="font-semibold text-sm">
                        {stringTruncate(selectedFile?.name, 38)}
                      </span>
                      <div className="flex items-center gap-3 w-full mt-1">
                        <span className="font-light text-xs text-zinc-400 shrink-0 text-nowrap">
                          {getFileSize(selectedFile?.size, 2)}
                        </span>
                        <Progress value={progress || 0} />
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={onReset}>
                    <X className="text-zinc-500" />
                  </Button>
                </div>
              </div>
            )}
            <AlertDialogFooter className="justify-center mt-16">
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                disabled={!selectedFile || isLoading}
                className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 "
                onClick={() => onSubmit(selectedFile)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-7 w-7 animate-spin" />
                    <span className="text-md ml-2">Carregando...</span>
                  </>
                ) : (
                  <>
                    <span className="text-md">Upload</span>
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
