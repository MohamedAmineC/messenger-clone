import getConversations from "../actions/getConversations"
import getUsers from "../actions/getUsers";
import SideBar from "../components/SideBar/SideBar"
import ConversationList from "./components/ConversationList"

export default async function ConversationsLayout({children}:{children:React.ReactNode}){
    const conversations = await getConversations();
    const users = await getUsers();
    return (
        //@ts-expect-error Server Component
        <SideBar>
            <div className="h-full">
                <ConversationList 
                initialItems={conversations}
                users={users}
                />
                {children}
            </div>
        </SideBar>
    )
}
