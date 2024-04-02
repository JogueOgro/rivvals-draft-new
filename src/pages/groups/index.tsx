import React, { useEffect } from 'react';

import HeadMetatags from '@/components/head-metatags';
import PageLayout from '@/components/page-layout';
import { Card } from '@/components/ui/card';
import { groupsEvent } from '@/store/groups/groups-events';
import { groupsInitialState } from '@/store/groups/groups-state';

import GroupsConfig from './config';
import RaffleButton from './raffleButton';
import GroupsRaffle from './raffleTables';

const GroupsPage = () => {
  useEffect(() => {
    groupsEvent(groupsInitialState);
  }, []);

  return (
    <>
      <HeadMetatags title="Groups" />
      <PageLayout>
        <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">Grupos</span>
            <span className="text-lg font-light pt-2">Sorteio de Grupos</span>
          </div>
        </div>
        <div className="flex gap-2">
          <GroupsConfig />
          <RaffleButton />
        </div>
        <div className="grid grid-cols-4 gap-14">
          <GroupsRaffle />
        </div>
      </PageLayout>
    </>
  );
};

export default GroupsPage;
