import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import api from '@/clients/api'
import CoinRanking from '@/components/coin-ranking'

export default function UserProfile() {
  const router = useRouter()

  const redirectToEdit = () => {
    console.log('CLICK')
    const asPath = router.asPath
    const newPath = `${asPath}/edit`
    router.push(newPath)
  }

  const [players, setPlayers] = useState([])

  const fetchPlayers = async () => {
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
    <div className="container">
      <header className="header">
        <input type="text" placeholder="Buscar..." className="search-bar" />
        <div className="icons">
          <i className="icon-notifications">🔔</i>
          <i className="icon-store">🛒</i>
        </div>
        <div className="user-menu">
          <img
            src="/ogroicon.png"
            alt="Foto do usuário"
            className="user-photo-small"
          />
          <span className="user-name">Peter Thorun</span>
        </div>
      </header>

      <section className="main-section">
        <div className="profile-section">
          <img
            src="/ogroicon.png"
            alt="Foto grande do usuário"
            className="user-photo-large"
          />
          <div className="user-details">
            <h2>Peter Thorun</h2>
            <p>Apelido: Ogro</p>
            <p>Email: ogro@levva.io</p>
            <p>Telefone: (11) 993045775</p>
            <p>Nível: Avançado</p>
            <button
              className="edit-profile-btn"
              onClick={() => {
                console.log('Teste de clique funcionando!')
                redirectToEdit()
              }}
            >
              Editar Perfil
            </button>
          </div>
        </div>

        <div className="status-section">
          <div>Participações: 5</div>
          <div>Jogo Favorito: CS 2</div>
          <div>Conquistas: 12</div>
          <div>Melhor Colocação: 1º</div>
          <div>Melhor Time: Pelé das Pistas</div>
          <div>Disponibilidade: Seg-Ter-Qua</div>
          <div>Torneios Vencidos: 3</div>
        </div>

        <div className="vertical-bar"></div>

        <div className="ratings-section">
          <h3>Avaliações</h3>
          <div className="rating-item">
            <span>Comunicação: </span>
            <span className="stars">★★★★★</span>
          </div>
          <div className="rating-item">
            <span>Pontualidade: </span>
            <span className="stars">★★★★☆</span>
          </div>
          <div className="rating-item">
            <span>Disponibilidade: </span>
            <span className="stars">★★★★☆</span>
          </div>
          <div className="rating-item">
            <span>Liderança: </span>
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
  )
}
