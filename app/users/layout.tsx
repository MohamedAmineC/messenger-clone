import React from 'react'
import SideBar from '../components/SideBar/SideBar'
import getUsers from '../actions/getUsers'
import UsersList from './Components/UsersList';

const layout = async ({children}:{children:React.ReactNode}) => {
  const users = await getUsers();
  return (
    //@ts-expect-error Server Component
    <SideBar>
        <div className='h-full'>
            <UsersList 
            items={users}
            />
            {children}
        </div>
    </SideBar>
  )
}

export default layout