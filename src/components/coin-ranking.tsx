export default function CoinRanking({ players, playerId }) {
  const sortedPlayers = [...players].sort((a, b) => b.coins - a.coins)
  const player = sortedPlayers.find((player) => player.idplayer === playerId)
  const topPlayers = sortedPlayers.slice(0, 10)

  const playerRank = player
    ? sortedPlayers.findIndex((p) => p.idplayer === playerId) + 1
    : null

  const shouldDisplayPlayer =
    player && !topPlayers.some((p) => p.idplayer === playerId)

  return (
    <div className="">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left w-10 text-sm">#</th>
              <th className="px-4 py-2 text-left text-sm">Nome</th>
              <th className="px-4 py-2 text-left w-20 text-sm">Coins</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player, index) => (
              <tr
                key={player.idplayer}
                className={`border-t ${player.idplayer === playerId ? 'bg-yellow-100' : ''}`}
              >
                <td className="px-4 py-2 text-center text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm">{player.nick}</td>
                <td className="px-4 py-2 text-center text-sm">
                  {player.coins}
                </td>
              </tr>
            ))}
            {shouldDisplayPlayer && (
              <tr className="border-t bg-yellow-100">
                {/* Exibindo o jogador na 11ª posição com a classificação original */}
                <td className="px-4 py-2 text-center text-sm">{playerRank}</td>
                <td className="px-4 py-2 text-sm">{player.nick}</td>
                <td className="px-4 py-2 text-center text-sm">
                  {player.coins}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
