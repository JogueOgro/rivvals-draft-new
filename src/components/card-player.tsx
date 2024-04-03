import React, { useEffect, useState } from 'react';
import { Star, Trophy } from 'lucide-react';
import { IPlayer } from '@/domain/player.domain';

type IProps = {
  player: IPlayer;
  onSelect: (value: IPlayer) => void;
  index: number; // Adicionando índice como propriedade
};

const PlayerCard = ({ player, onSelect, index }: IProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const delayFactor = 0.1;
    const delay = index * delayFactor * 1000;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      onClick={() => onSelect(player)}
      key={player.id}
      className={`w-full min-h-[500px] flex flex-col items-center justify-center cursor-pointer  mt-[-50px] ${isVisible ? 'animate-slide-in' : '' // Adicionando classe de animação se isVisible for true
        }`}
      style={{
        backgroundImage: 'url("./static/card.webp")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        key={player.id}
        className="w-[280px] h-[405px] rounded-tl-md rounded-tr-md mt-[62px]"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0)), url("${player.photo || './static/empty.webp'
            }")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex flex-1 h-full flex-col text-white">
          <span className="font-bold text-[52px] ml-2">{player.score}</span>
          <div className="flex flex-1 h-full items-end">
            <div className="w-full flex items-center flex-col">
              <div className="flex items-center gap-4 mb-4 text-lg font-bold ">
                <div className="flex items-center gap-2">
                  <Trophy className="" /> {player.wins}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="" /> {player.power}
                </div>
              </div>
              <span className="font-bold text-lg ">{player.nick}</span>
              <div className="w-[150px] h-[1px] my-1 bg-white" />
              <small className=" mb-2 text-[10px]">{player.name}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
