'use client';

import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { MENU_DATA, MenuItem } from '@/lib/static-data';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export function NavMain() {
  const pathname = usePathname();
  const isActiveUrl = MENU_DATA.find(item => pathname.startsWith(item.url))?.url || '';
  const [activeItem, setActiveItem] = useState<string>(isActiveUrl);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Цэс</SidebarGroupLabel>
      <SidebarMenu>
        {MENU_DATA.map((item: MenuItem) => {
          const hasChildren = item.items && item.items.length > 0;

          if (!hasChildren) {
            // Parent item without children - make it clickable
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url || '#'}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // Parent item with children - collapsible
          return (
            <Collapsible
              key={item.title}
              asChild
              open={activeItem === item.url}
              onOpenChange={e => {
                setActiveItem(item.url);
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map(subItem => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
