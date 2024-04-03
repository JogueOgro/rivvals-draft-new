'use client'

/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from './ui/button';

export type IMenuItemProps = {
  menu: string,
  route: string,
  icon: any,
  showSidebar?: boolean,
  children?: { menu: string, route: string }[],
};

export default function MenuItem(props: IMenuItemProps) {
  const { icon: IconMenu } = props;
  const route = useRouter();
  const asChildren = !!props?.children?.length;

  function navigateToMenu(routePath: string) {
    route.push(`/${routePath}`);
  }

  if (!asChildren) {
    return (
      <Button
        key={props.route}
        variant="outline"
        className="rounded-none w-full py-7 border-0 bg-transparent"
        onClick={() => navigateToMenu(props.route)}
      >
        <div className={`w-full flex items-center justify-between`}>
          <div
            className={`w-full flex items-center ${
              !props?.showSidebar ? 'justify-center' : ''
            }`}
          >
            <IconMenu
              className="text-#757575 w-6"
            />
            {props?.showSidebar && (
              <span
                className="pl-4 text-sm text-[#212121]"
              >
                {props.menu}
              </span>
            )}
          </div>
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          key={props.route}
          variant="outline"
          className="rounded-none w-full py-7 border-0 bg-transparent"
        >
          <div className={`w-full flex items-center justify-between`}>
            <div
              className={`w-full flex items-center ${
                !props?.showSidebar ? 'justify-center' : ''
              }`}
            >
              <IconMenu
                className="text-#757575 w-6"
              />
              {props?.showSidebar && (
                <span
                  className="pl-4 text-sm text-[#212121]"
                >
                  {props.menu}
                </span>
              )}
            </div>
            {props?.showSidebar && <ChevronRight className="text-[#757575]" />}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right" align="start">
        <DropdownMenuLabel>{props.menu}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {props?.children?.map((item) => (
            <DropdownMenuItem
              key={item.route}
              className="cursor-pointer"
              onClick={() => navigateToMenu(item.route)}
            >
              {item.menu}
              <DropdownMenuShortcut>
                <ArrowRight className="text-[#212121] w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
