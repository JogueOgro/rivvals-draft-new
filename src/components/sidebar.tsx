/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowRightSquare,
  Swords,
} from 'lucide-react';
import { useRouter } from 'next/router';

import logoImg from '@/assets/logo.png'

import MenuItem from './menu-item';
import sidebarMenuItems from './menus-sidebar';
import Image from 'next/image';
import { Button } from './ui/button';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

type IProps = {
  showSidebar: boolean;
};

const Sidebar = ({ showSidebar }: IProps) => {
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
        <div className="flex justify-center w-full relative">
          <Image
            src={logoImg}
            alt="logo"
            width={showSidebar ? 100 : 50}
            height={0}
            className="pt-4"
          />
        </div>
        <div className="flex w-full pt-4">
          <Button
            onClick={() => route.push('/draft')}
            className="rounded-none w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-8"
          >
            <div
              className={`w-full flex items-center ${!showSidebar ? 'justify-center' : 'justify-between'
                }`}
            >
              {showSidebar && <span className="text-md">Draft</span>}
              <Swords className="w-6" />
            </div>
          </Button>
        </div>

        <div className="border border-b-0 border-x-0 border-slate-300">
          {sidebarMenuItems.map((item) => (
            <div className="border border-t-0 border-x-0 border-slate-300">
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
    </div >
  );
};

export default Sidebar;
