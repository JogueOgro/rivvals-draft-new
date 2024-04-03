import { Download } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

import * as XLSX from 'xlsx'

const DownloadButton = () => {
  const handleDownload = () => {
    const data = [
      {
        name: '',
        nick: '',
        power: '',
        tags: '',
        wins: '',
        score: '',
        email: '',
        photo: '',
      },
    ]
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'importacao')
    XLSX.writeFile(wb, 'modelo_importacao.xlsx')
  }

  return (
    <Button
      onClick={handleDownload}
      variant="default"
      className="py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900"
    >
      <div className="w-full flex items-center justify-between space-x-2">
        <Download className="w-4" />
        <span className="text-md">Baixar modelo</span>
      </div>
    </Button>
  )
}

export default DownloadButton
