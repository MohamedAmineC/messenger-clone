"use client"

import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes'
import React from 'react'
import MobileItem from './MobileItem';

const MobileFooter = () => {
    const routes = useRoutes();
    const {isOpen} = useConversation();
    if(isOpen) {
        return null
    }
  return (
    <div className='fixed flex justify-between items-center w-full bottom-0 z-40 bg-white border-t-[1px] lg:hidden'>
        {routes.map(route => (
            <MobileItem 
            key={route.label}
            href={route.href}
            active={route.active}
            icon={route.icon}
            onClick={route.onClick}
            />
        ))}
    </div>
  )
}

export default MobileFooter