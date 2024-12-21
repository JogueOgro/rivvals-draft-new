'use client'

import { useRouter } from 'next/router'

export default function ProfileSection(props) {
  const router = useRouter()
  const player = props.player

  const redirectToEdit = () => {
    const asPath = router.asPath
    const newPath = `${asPath}/edit`
    router.push(newPath)
  }

  const backendURL = 'http://localhost/'

  return (
    <>
      <aside className="profile-section flex flex-col gap-4 !w-[65%] shadow-md">
        <div className="relative w-full aspect-square">
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
          <h2 className="text-lg font-bold text-center">Peter Thorun</h2>
          <p>Apelido: Ogro</p>
          <p>Email: ogro@levva.io</p>
          <p>Telefone: (11) 993045775</p>
          <p>Nível: Avançado</p>
          <button
            className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
            onClick={() => {
              redirectToEdit()
            }}
          >
            Editar Perfil
          </button>
        </div>
        <div className="status-section flex flex-col text-sm">
          <div>Participações: 5</div>
          <div>Jogo Favorito: CS 2</div>
          <div>Conquistas: 12</div>
          <div>Melhor Colocação: 1º</div>
          <div>Melhor Time: Pelé das Pistas</div>
          <div>Disponibilidade: Seg-Ter-Qua</div>
          <div>Torneios Vencidos: 3</div>
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
