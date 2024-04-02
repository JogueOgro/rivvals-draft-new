import { IPlayer } from '@/domain/player.domain';
import draftStore from '@/store/draft/draft-store';
import { useStore } from 'effector-react';
import cardImg from '@/assets/card.png'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import playerStore from '@/store/player/player-store';


const PlayersSelect = () => {
  const { players } = useStore(playerStore)

  return (
    <div className="w-full p-16">
      <span className='font-bold text-xl'>Selecione um player</span>
      <div className="flex flex-wrap justify-center gap-4">
        {players?.map(player => (
          <div key={player.id} className="flex flex-col items-center justify-center">
            <Image
              src={cardImg}
              alt="logo"
              width={200}
              height={200}
              className="pt-4"
            />
            <span className="text-center font-bold mt-[-10px]">{player?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayersSelect;