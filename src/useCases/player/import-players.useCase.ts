import { IPlayer } from "@/domain/player.domain";
import { uuid } from "uuidv4";
import { playerEvent } from "@/store/player/player-events";
import playerStore from "@/store/player/player-store";

const execute = async (dataSource: IPlayer[], cb: () => void) => {
  try {
    const { pageSize } = playerStore.getState()
    playerEvent({ isLoading: true })
      const totalRegistries = dataSource.length;
      const totalPages = Math.ceil(totalRegistries / pageSize)
      const formattedData = dataSource?.map((row) => {
        return {
          ...row,
          id: uuid(),
          createdAt: new Date().toISOString()
        }
      }).filter(row => !!row?.name && !!row?.email)
      playerEvent({ isLoading: false, dataSource: formattedData, totalRegistries, totalPages })
      cb()
    } catch(e) {
      window.alert('Ocorreu um erro, verifique o arquivo de importação e tente novamente.')
    }
}

export const importPlayersUseCase = { execute }