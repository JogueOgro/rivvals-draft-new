import { useEffect, useState } from 'react'

import api from '@/clients/api'
import CoinRanking from '@/components/coin-ranking'
import HeadMetatags from '@/components/head-metatags'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UserSidebar from '@/components/user-sidebar'
import authStore from '@/store/auth/auth-store'

import ConfirmMatch from './components/confirm-match'
import FeedSection from './components/feed'
import CalendarSection from './components/player-calendar'
import PlayerEdit from './components/player-edit'
import ProfileSection from './components/player-profile'

export default function UserProfile() {
  const { username, email } = authStore.getState()
  const [player, setPlayer] = useState({})
  const [players, setPlayers] = useState([])
  const [visibility, setVisibility] = useState('feed')
  const backendURL = 'http://localhost/'

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/player/email/' + email)
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
      <UserSidebar username={username} />
      <header className="w-[calc(100%-75px)] bg-white shadow-md z-10 fixed top-0 left-[76px] px-4 py-2 flex justify-between items-center">
        <input type="text" placeholder="Buscar..." className="search-bar" />
        <div className="icons">
          <i className="icon-notifications">🔔</i>
          <i className="icon-store">🛒</i>
        </div>
        <div className="user-menu flex items-center">
          <Avatar>
            <AvatarImage
              src={
                player.photo
                  ? backendURL + player.photo
                  : backendURL + '/pictures/incognito.jpg'
              }
              alt="Player Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="user-name ml-2">Peter Thorun</span>
        </div>
      </header>

      <div className="container-profile ml-20 overflow-x-hidden pr-1 pl-2 mr-2">
        <div className="container-profile flex flex-row items-start gap-4">
          <ProfileSection player={player} setVisibility={setVisibility} />

          <main className="feed-section w-[40%] bg-gray-100 shadow-md flex flex-col items-start">
            {visibility === 'confirm' && (
              <>
                <ConfirmMatch player={player} />
              </>
            )}
            {visibility === 'feed' && (
              <>
                <FeedSection />
              </>
            )}
            {visibility === 'edit' && (
              <>
                <PlayerEdit />
              </>
            )}
            {visibility === 'calendar' && (
              <>
                <CalendarSection />
              </>
            )}
          </main>

          <aside className="ranking-section flex flex-col p-4 bg-white shadow-md w-[25%]">
            <span className="text-lg font-bold mb-4">Ranking de Coins</span>
            <CoinRanking players={players} playerId={player.idplayer} />
          </aside>
        </div>
      </div>
    </>
  )
}
