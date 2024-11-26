'use client'

import {
  Check,
  ChevronsUpDown,
  Loader2,
  StepForward,
  Trophy,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import logoPp from '@/assets/logopp.png'
import versus from '@/assets/versus.png'
import api from '@/clients/api'
import HeadMetatags from '@/components/head-metatags'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { IPlayer } from '@/domain/player.domain'
import { cn } from '@/lib/utils'
import { processWinnerPingPong } from '@/useCases/player/proccess-winner-pingpong.UseCase'

export default function LoginPage() {
  const router = useRouter()
  const [players, setPlayers] = useState([])
  const [player1nick, setPlayer1Nick] = useState('')
  const [player2nick, setPlayer2Nick] = useState('')
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [value, setValue] = useState('')
  const [value2, setValue2] = useState('')
  const [open2, setOpen2] = useState(false)
  const [inPlay, setInPlay] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const radio1 = useRef<HTMLDivElement>(null)
  const radio2 = useRef<HTMLDivElement>(null)

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players')
      setPlayers(response.data)
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

  const playMatch = () => {
    if (!value || !value2 || value === value2) {
      alert('Selecione os dois jogadores corretamente!')
      return
    }
    const nick1 = players.find(
      (player) => player.nick.toLowerCase() === value,
    ).nick
    setPlayer1Nick(nick1)
    const nick2 = players.find(
      (player) => player.nick.toLowerCase() === value2,
    ).nick
    setPlayer2Nick(nick2)
    setInPlay(true)
  }

  const proccessWinner = async () => {
    let winner = ''
    const player1: IPlayer = players.find(
      (player) => player.nick === player1nick,
    )
    const player2: IPlayer = players.find(
      (player) => player.nick === player2nick,
    )

    if (!player1 || !player2) {
      alert('Jogador(es) não encontrado(s). Verifique os nicks.')
      return
    }

    const data = {}

    if (radio1.current.getAttribute('data-state') === 'checked') {
      winner = 'player1'
    } else if (radio2.current.getAttribute('data-state') === 'checked') {
      winner = 'player2'
    } else {
      alert('Selecione o vencedor!')
      return
    }
    setIsLoading(true)
    await processWinnerPingPong.execute({
      player1: { ...player1 },
      player2: { ...player2 },
      winner,
    })
    router.push('/ranked/pingpong/standings')
  }

  const controlModal = () => {
    setOpenModal(false)
    setIsLoading(false)
  }

  return (
    <>
      <HeadMetatags title="Ranked" />
      <div className="bg-muted overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col py-4 rounded-3xl animate-in fade-in shadow-lg transition-all duration-1000 bg-white border-md min-w-[30vw] pb-12 backdrop-filter backdrop-blur-lg bg-opacity-30">
          <Image
            src={logoPp}
            alt="img"
            width={180}
            className="self-center mb-4"
            priority
          />

          <div className="flex w-full items-center justify-center mt-4">
            <div style={{ display: !inPlay ? 'block' : 'none' }}>
              <div className="flex items-center gap-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? players.find(
                            (player) => player.nick.toLowerCase() === value,
                          )?.nick
                        : 'Buscar Player 1'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Player 1" />
                      <CommandList>
                        <CommandEmpty>
                          Player não encontrado. Cadastre-se!
                        </CommandEmpty>
                        <CommandGroup>
                          {players.map((player) => (
                            <CommandItem
                              key={player.nick}
                              value={player.nick}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? '' : currentValue,
                                )
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  value === player.nick
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {player.nick}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Image
                  src={versus}
                  alt="img"
                  width={60}
                  className="self-center"
                  priority
                />

                <Popover open={open2} onOpenChange={setOpen2}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value2
                        ? players.find(
                            (player) => player.nick.toLowerCase() === value2,
                          )?.nick
                        : 'Buscar player 2'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Player 2" />
                      <CommandList>
                        <CommandEmpty>
                          Player não encontrado. Cadastre-se!
                        </CommandEmpty>
                        <CommandGroup>
                          {players.map((player) => (
                            <CommandItem
                              key={player.nick}
                              value={player.nick}
                              onSelect={(currentValue) => {
                                setValue2(
                                  currentValue === value2 ? '' : currentValue,
                                )
                                setOpen2(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  value2 === player.nick
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {player.nick}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-full flex-col flex justify-center items-center mt-6 gap-6">
                <Button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  onClick={() => playMatch()}
                >
                  <div className="flex items-center gap-2">
                    <StepForward className="w-5 h-5" />
                    <span>Play</span>
                  </div>
                </Button>
              </div>
            </div>

            <div style={{ display: inPlay ? 'block' : 'none' }}>
              <div className="text-xs text-center mb-4">
                Quem fizer 7 primeiro vence!
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 max-w-[500px]">
                  <input
                    className="border-none bg-transparent text-center"
                    placeholder="Player 1"
                    value={player1nick}
                  />

                  <Image
                    src={versus}
                    alt="img"
                    width={60}
                    className="self-center"
                    priority
                  />

                  <input
                    className="border-none bg-transparent text-center"
                    placeholder="Player 2"
                    value={player2nick}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center mt-8 gap-4">
                <Button
                  className="w-1/2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  onClick={() => setOpenModal(true)}
                >
                  <div className="flex items-center gap-4">
                    <Trophy className="w-5 h-5" />
                    <span>Vencedor</span>
                  </div>
                </Button>
              </div>
              <div className="w-full flex-col flex justify-center items-center mt-6 gap-6">
                <Dialog open={openModal} onOpenChange={controlModal}>
                  <DialogTrigger asChild></DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Selecionar Vencedor</DialogTitle>
                    </DialogHeader>
                    <div
                      className={`flex flex-col items-center justify-center border-2 rounded-lg 'bg-blue-100 border-solid' : 'border-dashed'}`}
                    >
                      <RadioGroup defaultValue="comfortable">
                        <div className="flex items-center space-x-2 mt-8">
                          <RadioGroupItem
                            ref={radio1}
                            value={player1nick}
                            id="player1nick"
                          />
                          <Label htmlFor="r1">{player1nick}</Label>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <RadioGroupItem
                            ref={radio2}
                            value={player2nick}
                            id="player2nick"
                          />
                          <Label htmlFor="r2">{player2nick}</Label>
                        </div>
                      </RadioGroup>
                      <div className="w-full flex-col flex justify-center items-center mt-6">
                        <DialogFooter>
                          <Button
                            className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 mb-6"
                            type="submit"
                            onClick={() => proccessWinner()}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-7 w-7 animate-spin" />
                                <span className="text-md ml-2">
                                  Carregando...
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-md">Salvar</span>
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
