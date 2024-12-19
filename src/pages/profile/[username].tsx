import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import api from '@/clients/api'
import CoinRanking from '@/components/coin-ranking'
import HeadMetatags from '@/components/head-metatags'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function UserProfile() {
  const router = useRouter()

  const redirectToEdit = () => {
    console.log('CLICK')
    const asPath = router.asPath
    const newPath = `${asPath}/edit`
    router.push(newPath)
  }

  const backendURL = 'http://localhost/'
  const [player, setPlayer] = useState({})
  const [players, setPlayers] = useState([])

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/player/email/ogro@levva.io')
      setPlayer(response.data)
    } catch (error) {
      console.error('Erro na busca de jogadores:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }

    try {
      const response = await api.get('/players')
      const data = response.data
      setPlayers(data)
    } catch (error) {
      console.error('Erro ao buscar players:', error.message)
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
      <HeadMetatags title="Perfil do Jogador" />
      <div className="container">
        <header className="header">
          <input type="text" placeholder="Buscar..." className="search-bar" />
          <div className="icons">
            <i className="icon-notifications">🔔</i>
            <i className="icon-store">🛒</i>
          </div>
          <div className="user-menu">
            <Avatar>
              <AvatarImage src="/ogroicon.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="user-name">Peter Thorun</span>
          </div>
        </header>

        <section className="main-section flex items-start justify-between gap-6 p-4">
          <div className="profile-section flex items-center gap-4">
            <div className="relative w-[200px] aspect-square">
              <img
                src={
                  player.photo
                    ? backendURL + player.photo
                    : backendURL + '/pictures/incognito.jpg'
                }
                alt="Profile"
                className="absolute w-[60%] h-[60%] rounded-full object-cover top-[17%] left-[20%] z-[1]"
              />
              <img
                src="/moldura.png"
                alt="Frame"
                className="absolute w-full h-full top-0 left-0 z-[2] pointer-events-none"
              />
            </div>
            <div className="user-details flex flex-col">
              <h2 className="text-xl font-bold">Peter Thorun</h2>
              <p className="text-sm">Apelido: Ogro</p>
              <p className="text-sm">Email: ogro@levva.io</p>
              <p className="text-sm">Telefone: (11) 993045775</p>
              <p className="text-sm">Nível: Avançado</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  console.log('Teste de clique funcionando!')
                  redirectToEdit()
                }}
              >
                Editar Perfil
              </button>
            </div>
          </div>
          <div className="status-section flex flex-col gap-2 text-sm">
            <div>Participações: 5</div>
            <div>Jogo Favorito: CS 2</div>
            <div>Conquistas: 12</div>
            <div>Melhor Colocação: 1º</div>
            <div>Melhor Time: Pelé das Pistas</div>
            <div>Disponibilidade: Seg-Ter-Qua</div>
            <div>Torneios Vencidos: 3</div>
          </div>
          <div className="vertical-bar w-[1px] bg-gray-300"></div>
          <div className="ratings-section flex flex-col gap-3 text-sm">
            <h3 className="text-lg font-bold">Avaliações</h3>
            <div className="rating-item flex justify-between">
              <span>Comunicação:</span>
              <span className="stars">★★★★★</span>
            </div>
            <div className="rating-item flex justify-between">
              <span>Pontualidade:</span>
              <span className="stars">★★★★☆</span>
            </div>
            <div className="rating-item flex justify-between">
              <span>Disponibilidade:</span>
              <span className="stars">★★★★☆</span>
            </div>
            <div className="rating-item flex justify-between">
              <span>Liderança:</span>
              <span className="stars">★★☆☆☆</span>
            </div>
          </div>
        </section>

        <div className="body-content">
          <div className="feed">
            Feed de notícias
            <div>Vagas em Aberto</div>
            <div>News</div>
            <div>Calendário de Eventos</div>
          </div>
          <aside className="achievements-history">
            <CoinRanking players={players} playerId={1} />
          </aside>
        </div>
      </div>
    </>
  )
}
