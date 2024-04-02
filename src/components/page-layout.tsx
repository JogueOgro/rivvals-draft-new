/* eslint-disable prettier/prettier */
import { ReactNode, useEffect, useState } from 'react';


import Sidebar from './sidebar';
import useMedia from 'use-media';

const PageLayout = ({ children }: { children: ReactNode }) => {
  const isMobile = useMedia({ maxWidth: 1024 });
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [isMobile]);

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url("/static/background.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Sidebar {...{ showSidebar, setShowSidebar }} />
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          marginLeft: showSidebar ? 250 : 75,
        }}
      >
        <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
