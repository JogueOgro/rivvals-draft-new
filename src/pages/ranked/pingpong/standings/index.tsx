'use client'

import { Loader2, MoveLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import api from '@/clients/api'
import HeadMetatags from '@/components/head-metatags'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function LoginPage() {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const sortByScore = (player1, player2) => {
    return player2.score_pingpong - player1.score_pingpong
  }

  const fetchPlayers = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/players')
      const allplayers = response.data
      const filteredPlayers = allplayers.filter((player) =>
        Number.isInteger(player.score_pingpong),
      )
      filteredPlayers.sort(sortByScore)
      setPlayers(filteredPlayers)
      setIsLoading(false)
    } catch (error) {
      console.error('Erro na busca de jogadores:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  return (
    <>
      <HeadMetatags title="Ranked" />
      <div className="bg-muted flex w-full min-h-screen p-4 flex-col items-center">
        <div className="mb-8 w-full flex justify-center mt-8">
          <Button
            className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
            onClick={() => router.push('/ranked/pingpong')}
          >
            <MoveLeft className="h-7 w-7" />
            <span className="text-md ml-2">Voltar</span>
          </Button>
        </div>

        <div className="flex flex-col py-6 rounded-3xl animate-in fade-in shadow-lg transition-all duration-1000 bg-white border-md w-full max-w-[800px] pb-12 backdrop-filter backdrop-blur-lg bg-opacity-30">
          <div className="text-lg text-center font-semibold mb-6">
            Ranking dos Jogadores
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Posição</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Nick</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <div className="w-full flex justify-center items-center mt-6">
                    <Loader2 className="h-7 w-7 animate-spin" />
                    <span className="text-md ml-2">Carregando...</span>
                  </div>
                </>
              ) : (
                <>
                  {players.map((player, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{player.name || 'N/A'}</TableCell>
                      <TableCell>{player.nick || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        {player.score_pingpong || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
