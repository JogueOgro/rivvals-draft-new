/* eslint-disable @typescript-eslint/no-explicit-any */
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { ArrowRightSquare, Swords } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import logoImg from '@/assets/logo.png';

import MenuItem from './menu-item';
import sidebarMenuItems from './menus-sidebar';
import { Button } from './ui/button';

type IProps = {
  showSidebar: boolean;
  setShowSidebar: (v: boolean) => void;
};

const Sidebar = ({ showSidebar, setShowSidebar }: IProps) => {
  const route = useRouter();

  const handleExit = () => {
    localStorage.clear();
    route.push('/');
  };

  return (
    <div
      className="flex flex-col h-screen justify-between fixed shadow-2xl transition-width duration-200 ease-in-out bg-white"
      style={{
        width: showSidebar ? 250 : 75,
        borderRadius: showSidebar ? '0 32px 32px 0' : '',
      }}
    >
      <div>
        {!showSidebar && (
          <Button
            variant="outline"
            onClick={() => setShowSidebar(!showSidebar)}
            className=" rounded-full p-2 w-10 h-10 flex items-center justify-center ml-5 mt-4"
          >
            <HamburgerMenuIcon className="w-15 h-15 text-slate-500" />
          </Button>
        )}
        <div className="flex justify-center w-full relative">
          <Image
            src={logoImg}
            alt="logo"
            width={showSidebar ? 100 : 50}
            height={0}
            className="pt-4"
          />
          {showSidebar && (
            <Button
              variant="outline"
              onClick={() => setShowSidebar(!showSidebar)}
              className="ring-1 ring-purple-100 rounded-full p-2 absolute right-[-8%] top-[45%] w-10 h-10 flex items-center justify-center"
            >
              <HamburgerMenuIcon className="w-15 h-15 text-slate-500" />
            </Button>
          )}
        </div>
        <div className="flex w-full pt-4">
          <Button
            onClick={() => route.push('/draft')}
            className="rounded-none w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-8"
          >
            <div
              className={`w-full flex items-center ${
                !showSidebar ? 'justify-center' : 'justify-between'
              }`}
            >
              {showSidebar && <span className="text-md">Draft</span>}
              <Swords className="w-6" />
            </div>
          </Button>
        </div>

        <div className="border border-b-0 border-x-0 border-slate-300">
          {sidebarMenuItems.map((item) => (
            <div
              key={item.menu}
              className="border border-t-0 border-x-0 border-slate-300"
            >
              <MenuItem key={item.menu} {...{ ...item, showSidebar }} />
            </div>
          ))}
        </div>
      </div>
      <div
        className="border border-b-0 border-x-0 border-slate-300"
        onClick={handleExit}
      >
        <MenuItem
          key={sidebarMenuItems.length + 1}
          menu={'Log Out'}
          route={'/'}
          icon={ArrowRightSquare}
          showSidebar={showSidebar}
        />
      </div>
    </div>
  );
};

export default Sidebar;
