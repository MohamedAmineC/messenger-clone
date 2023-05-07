import React from 'react'
import SideBar from '../components/SideBar/SideBar'

const layout = async ({children}:{children:React.ReactNode}) => {
  return (
    //@ts-expect-error Server Component
    <SideBar>
        <div className='h-full'>
            {children}
        </div>
    </SideBar>
  )
}

export default layout