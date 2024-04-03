import { PlayCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useStore } from 'effector-react';
import draftStore from '@/store/draft/draft-store';
import { draftEvent } from '@/store/draft/draft-events';

const TimerClock = React.memo(() => {
  const { isActiveTimer, timerSeconds } = useStore(draftStore)

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActiveTimer && timerSeconds > 0) {
      interval = setInterval(() => {
        draftEvent({ timerSeconds: timerSeconds - 1 });
      }, 1000);
    } else {
      draftEvent({ isActiveTimer: false });
      return
    }

    return () => clearInterval(interval);
  }, [isActiveTimer, timerSeconds]);

  return (
    <div className="absolute right-[48px] top-[4px]">
      <div className="w-full flex justify-end">
        <Button
          variant='ghost'
          className="rounded-sm mr-[-10px]"
          onClick={() => {
            if (isActiveTimer) {
              draftEvent({ isActiveTimer: false, timerSeconds: 60 })
            } else {
              draftEvent({ isActiveTimer: true, timerSeconds: 60 })
            }
          }}
        >
          {isActiveTimer ? <XCircle className="text-red-500" /> : <PlayCircle className="text-blue-600" />}
        </Button>
      </div>
      <Card className="w-32 h-32 rounded-sm shadow-lg flex items-center justify-center">
        <span className="text-[50px] font-bold transition-all duration-1000 animate-pulse">{timerSeconds % 60}</span>
      </Card>
    </div>
  );
});

export default TimerClock;
