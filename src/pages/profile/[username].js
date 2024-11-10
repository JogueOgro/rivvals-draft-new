import { useRouter } from 'next/router'

export default function UserProfile() {
  const router = useRouter()
  const { username } = router.query

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
            class="user-photo-small"
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
            <button className="edit-profile-btn">Editar Perfil</button>
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
          <h3>Ranking Moedas Rivvals</h3>
          <ul className="ranking-list">
            {[
              { name: 'Debora Leite', coins: 6 },
              { name: 'Gustavo Barros', coins: 5 },
              { name: 'Marcelo Tenório', coins: 4 },
              { name: 'Lucas Fegueredo', coins: 4 },
              { name: 'Tati Kaori', coins: 3 },
              { name: 'Ogro', coins: 2 },
            ]
              .sort((a, b) => b.coins - a.coins) // Ordena pela quantidade de moedas
              .map((player, index) => (
                <li key={index} className="ranking-item">
                  <span className="ranking-position">{index + 1}</span>
                  <span className="player-name">{player.name}</span>
                  <span className="player-coins">{player.coins} Rv$</span>
                </li>
              ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
