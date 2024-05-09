/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { IPlayer } from '@/domain/player.domain'

import * as XLSX from 'xlsx'

interface ImportButtonProps {
  onImport: (data: IPlayer[]) => void
}

const ImportButton: React.FC<ImportButtonProps> = ({ onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
  }

  const handleClickUpload = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImport = (file: File | null) => {
    if (!file) {
      console.log('Nenhum arquivo selecionado')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (!e.target?.result) return
      const data = new Uint8Array(e.target.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const importedData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      }) as any[][]
      const players: IPlayer[] = importedData.slice(1).map((row) => ({
        name: row[0] || '',
        nick: row[1] || '',
        stars: parseInt(row[2] as string) || 0,
        medal: parseInt(row[3] as string) || 0,
        wins: parseInt(row[4] as string) || 0,
        tags: row[5] || '',
        score: row[6] || '',
        email: row[7] || '',
        photo: row[8] || '',
      }))
      onImport(players)
    }
    reader.readAsArrayBuffer(file)
  }

  useEffect(() => {
    if (selectedFile) {
      handleImport(selectedFile as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile])

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <Button
        variant="default"
        className="py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 "
        onClick={handleClickUpload}
      >
        <div className="flex items-center space-x-2">
          <Upload className="w-4" />
          <span className="text-md">Importar arquivo</span>
        </div>
      </Button>
    </div>
  )
}

export default ImportButton
