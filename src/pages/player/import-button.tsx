import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { IPlayer } from '@/domain/player.domain';
import { Upload } from 'lucide-react';

interface ImportButtonProps {
  onImport: (data: IPlayer[]) => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({ onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    handleImport(file as any);
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = (file: File | null) => {
    if (!file) {
      console.log('Nenhum arquivo selecionado');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      const players: IPlayer[] = importedData.slice(1).map(row => ({
        name: row[0] || '',
        nick: row[1] || '',
        power: parseFloat(row[2] as any) || 0,
        tags: row[3] || '',
        wins: row[4] || '',
        score: row[5] || '',
        email: row[6] || ''
      }));
      onImport(players);
    };
    reader.readAsArrayBuffer(file);
  };

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
        className="py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900"
        onClick={handleClickUpload}
      >
        <div className="flex items-center space-x-2">
          <Upload className="w-4" />
          <span className="text-md">Importar arquivo</span>
        </div>
      </Button>
    </div>
  );
};

export default ImportButton;
