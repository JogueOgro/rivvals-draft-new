'use client'

export default function ProfileSection(props) {
  const player = props.player

  const ToEdit = () => {
    props.setVisibility('edit')
  }

  const ToCalendar = () => {
    props.setVisibility('calendar')
  }

  const backendURL = 'http://localhost/'

  return (
    <>
      <aside className="profile-section flex flex-col gap-4 !w-[65%] shadow-md">
        <div
          className="relative w-full aspect-square cursor-pointer"
          onClick={() => {
            props.setVisibility('feed')
          }}
        >
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
        <div className="user-details flex flex-col text-sm">
          <h2 className="text-lg font-bold text-center">{player.name}</h2>
          <p>Apelido: {player.nick}</p>
          <p>
            Email:{' '}
            {player?.email
              ? player.email.length > 17
                ? `${player.email.slice(0, 17)}...`
                : player.email
              : 'Carregando...'}
          </p>
          <p>Título: {player.title}</p>
          <p>Nível: {player.level}</p>
          <div className="flex space-x-2">
            {player?.email === props.loggedUser.email && (
              <button
                className="px-2 py-1 text-xs bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 w-auto"
                onClick={() => {
                  ToEdit()
                }}
              >
                Editar Perfil
              </button>
            )}
            {player?.email === props.loggedUser.email && (
              <button
                className="px-2 py-1 text-xs bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 w-auto"
                onClick={() => {
                  ToCalendar()
                }}
              >
                Editar Agenda
              </button>
            )}
          </div>
        </div>
        <div className="status-section flex flex-col text-sm">
          {player?.favoriteGame && (
            <div>Jogo Favorito: {player.favoriteGame}</div>
          )}
          <div>Participações: {player.participations}</div>
          <div>Vitórias: {player.wins}</div>
          {player?.trophy && <div>Torneios Vencidos: {player?.trophy}</div>}
          {player?.achievments && <div>Conquistas: {player.achievments}</div>}
          {player?.bestPlacement && (
            <div>Melhor Colocação: {player.bestPlacement}</div>
          )}
          {player?.bestTeam && <div>Melhor Time: {player.bestTeam}</div>}
        </div>
        <div className="ratings-section text-sm">
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
      </aside>
    </>
  )
}
