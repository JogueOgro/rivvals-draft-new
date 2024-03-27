import React from 'react';

import HeadMetatags from '@/components/head-metatags';
import PageLayout from '@/components/page-layout';

import GroupsConfig from './config';

const GroupsPage = () => {
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
        <div className="flex items-center gap-2">
          <GroupsConfig />
        </div>
      </PageLayout>
    </>
  );
};

export default GroupsPage;
