import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

function ProfilePage(){

    const {user} = useAuth();

    const {profileInfo} = useProfile(user?.id)



    return(
        <>
            <div>{profileInfo?.name}</div>
            <img src={profileInfo?.url} alt="" />
        </>
        
    )
}

export default ProfilePage;