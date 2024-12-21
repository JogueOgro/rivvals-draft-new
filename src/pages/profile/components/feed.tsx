'use client'

import { Card } from '@/components/ui/card'

export default function FeedSection() {
  return (
    <>
      <div className="p-4 flex w-full z-0">
        <div className="p-4 flex flex-col rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] backdrop-filter backdrop-blur-lg bg-opacity-40 border-t border-t-gray-200">
          <h2 className="text-lg font-bold mb-4">Notícias</h2>
          <div className="feed-content space-y-4">
            <Card className="p-4">
              <div>Líder do Ranking do Ping-Pong</div>
              <div className="contents">
                <div className="flex items-center gap-4">
                  <img
                    src="/henricao.jpg"
                    alt="Profile"
                    height={160}
                    width={160}
                    className="rounded-full"
                  />
                  <p className="text-sm p-4">
                    O maravilhoso Henrique Muñoz é o líder invicto da ranqueada
                    do ping-pong na Levva e está com 1267 pontos na tabela, que
                    tal desafiá-lo para uma partida?
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div>Novas Vagas no Site da IZI - Indique!</div>
              <div className="contents">
                <div className="flex items-center gap-4">
                  <img
                    src="/izi.png"
                    alt="Profile"
                    height={160}
                    width={160}
                    className="rounded-full"
                  />
                  <p className="text-sm p-4">
                    A Izi cresceu 200% desde que adquiriu o Grupo NC como
                    cliente e está contratando novos colaboradores, indique seus
                    conhecidos!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
