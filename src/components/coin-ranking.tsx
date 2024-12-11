export default function CoinRanking({ players, playerId }) {
  const sortedPlayers = [...players].sort((a, b) => b.coins - a.coins)
  const player = sortedPlayers.find((player) => player.idplayer === playerId)
  const topPlayers = sortedPlayers.slice(0, 10)

  const playerRank = player
    ? sortedPlayers.findIndex((p) => p.idplayer === playerId) + 1
    : null

  // Se o jogador estiver no top 10, não remove ele da lista
  const playersToDisplay = topPlayers.filter((p) => p.idplayer !== playerId)

  // Exibe a Lara apenas uma vez, fora do top 10, se necessário
  const shouldDisplayPlayer =
    player && !topPlayers.some((p) => p.idplayer === playerId)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ranking de Coins</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left w-10">#</th>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left w-20">Coins</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers.map((player, index) => (
            <tr key={player.idplayer} className="border-t">
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td
                className={`px-4 py-2 ${player.idplayer === playerId ? 'bg-yellow-100 font-bold' : ''}`}
              >
                {player.nick}
              </td>
              <td className="px-4 py-2 text-center">{player.coins}</td>
            </tr>
          ))}
          {shouldDisplayPlayer && (
            <tr className="border-t bg-yellow-100">
              <td className="px-4 py-2 text-center">{playerRank}</td>
              <td className="px-4 py-2">{player.nick}</td>
              <td className="px-4 py-2 text-center">{player.coins}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
