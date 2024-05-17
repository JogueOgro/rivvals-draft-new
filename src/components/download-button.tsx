import { Download } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import mockPlayers from '@/lib/mockPlayers.json'

import * as XLSX from 'xlsx'

type IProps = {
  text: string
}

const DownloadButton = ({ text }: IProps) => {
  const handleDownload = () => {
    const data = mockPlayers
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'importacao')
    XLSX.writeFile(wb, 'modelo_importacao.xlsx')
  }

  return (
    <Button
      variant="ghost"
      onClick={(e) => {
        e.preventDefault()
        handleDownload()
      }}
      className="bg-white ring-[0.2px] ring-black rounded-sm py-2 cursor-pointer"
    >
      <div className="w-full flex items-center justify-center space-x-2">
        <Download className="w-4" />
        <span className="text-md">{text}</span>
      </div>
    </Button>
  )
}

export default DownloadButton
