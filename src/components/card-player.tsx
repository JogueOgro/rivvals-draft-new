/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/rules-of-hooks */
import { StarFilledIcon } from '@radix-ui/react-icons'
import { useStore } from 'effector-react'
import { Medal, Trophy } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { IPlayer } from '@/domain/player.domain'
import { sleep } from '@/lib/utils'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'

import { motion } from 'framer-motion'

type IProps = {
  cardNumber: number
  player: IPlayer
  onSelect: (value: IPlayer) => void
  onForceSelect?: (value: IPlayer) => void
}

const audioFlip =
  typeof window !== 'undefined' ? new Audio('/static/flip.mp3') : null

const PlayerCard = ({ player, onSelect, cardNumber }: IProps) => {
  const { chat, config, activeTeamIndex } = useStore(draftStore)
  const [isOpen, setIsOpen] = useState(false)

  if (!player) {
    return <></>
  }

  const playerPhoto = isOpen ? player?.photo || './static/empty.webp' : ''
  const cardBackground = `linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0)), url("${playerPhoto}")`

  const handlePlayerSelect = async () => {
    if (audioFlip) audioFlip.play()
    setIsOpen(true)
    await sleep(2000)
    onSelect(player)
    setIsOpen(false)
  }

  useEffect(() => {
    if (chat && chat.length) {
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

        if (isCommandChose && isCardToSelect && isMemberOfTeam) {
          const newChatList = [...chat]?.map((obj) =>
            obj.id !== row.id ? obj : { ...row, isExecuted: true },
          )
          draftEvent({ chat: newChatList })
          handlePlayerSelect()
          break
        }
      }
    }
  }, [chat])

  useEffect(() => {
    setIsOpen(false)
  }, [cardNumber])

  return (
    <div
      onClick={() => {
        handlePlayerSelect()
      }}
      key={player.id}
      className={`w-full ${isOpen ? 'h-[500px] -mt-6' : 'h-[425px] mt-8'} flex flex-col items-center justify-center cursor-pointer animate-slide-in`}
      style={{
        perspective: '1000px',
        backgroundImage: !isOpen
          ? 'url("./static/card-back.jpg")'
          : 'url("./static/card.webp")',
        backgroundSize: !isOpen ? 'contain' : 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <motion.div
        className="w-[275px] h-[398px] rounded-tl-md rounded-tr-md mt-[48px]"
        style={{
          position: 'relative',
        }}
        animate={{ rotateY: isOpen ? 0 : 180 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="w-full h-full rounded-tl-md rounded-tr-md"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backfaceVisibility: 'hidden',
            backgroundImage: cardBackground,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-1 h-full flex-col text-white">
            <div className="flex items-center mt-2 ml-2">
              <motion.div
                className="text-yellow-300 w-8 h-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpen ? 1 : 0 }}
              >
                {new Array(Number(player.stars)).fill('').map((_, i) => (
                  <StarFilledIcon key={i} className="text-yellow-200 w-8 h-8" />
                ))}
              </motion.div>
            </div>
            {isOpen && (
              <div className="flex flex-1 h-full items-end">
                <div className="w-full flex items-center flex-col">
                  <div className="flex items-center gap-4 mb-4 text-lg font-bold ">
                    <motion.div
                      className="gap-2 flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                    >
                      <Trophy /> {player.wins}
                      <Medal /> {player.medal}
                    </motion.div>
                  </div>
                  <span className="font-bold text-lg ">{player.nick}</span>
                  <div className="w-[150px] h-[1px] my-1 bg-white" />
                  <small className=" mb-2 text-[10px]">{player.name}</small>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          className="w-full h-full rounded-tl-md rounded-tr-md bg-[#ddd]"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotateY(180deg)',
          }}
        >
          Back side
        </motion.div>
      </motion.div>
    </div>
  )
}

export default PlayerCard
