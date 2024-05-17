/* eslint-disable prettier/prettier */
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'

type IParams = {
  cardNumber: number
  handlePlayerSelect: () => void
}

const execute = ({ cardNumber, handlePlayerSelect }: IParams) => {
  const { chat, activeTeamIndex, activeTeamStartTurnDate, activeTeamEndTurnDate, config } = draftStore.getState()
  if (!chat || !chat.length) return

  const filteredChat = [...chat].filter((x) => x.isAction && !x.isExecuted)
  for (const row of filteredChat) {
    const userName = row?.user?.username?.toString().toLowerCase().trim()
    const [action, value] = row.message!.split(' ')

    const isCommandChose = action === '!escolher'
    const isCardToSelect = Number(value) === cardNumber

    const listMembersTwitchName = config?.teamList?.length
      ? config?.teamList[activeTeamIndex]?.players
        ?.filter((obj) => !!obj.twitch && obj.twitch !== '')
        ?.map((obj) => obj.twitch)
      : []

    const isMemberOfTeam = listMembersTwitchName?.some((twitchUserName) => {
      const playerName = twitchUserName!.toString().toLowerCase().trim()
      return playerName.includes(userName || '')
    })

    const isValidMessageDateWithinTheTeamTurn = row.created.getTime() >= activeTeamStartTurnDate.getTime() && row.created.getTime() <= activeTeamEndTurnDate.getTime()

    const isValidSelection = isCommandChose && isCardToSelect && isMemberOfTeam && isValidMessageDateWithinTheTeamTurn

    if (isValidSelection) {
      const newChatList = [...chat]?.map((obj) =>
        obj.id !== row.id ? obj : { ...row, isExecuted: true },
      )
      draftEvent({ chat: newChatList })
      handlePlayerSelect()
      return
    }
  }
}

export const handleChatPlayerSelectUseCase = { execute }
