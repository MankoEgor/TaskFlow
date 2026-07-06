import s from './ProfileIcon.module.css'

interface ProfileIconProps {
    name: string | null;
    avatarUrl: string | null;
    onClick?: () => void;
}

function ProfileIcon(profile : ProfileIconProps) {
    return (
        <>
            {profile.avatarUrl
                ? <img onClick={profile.onClick} className={s.profileImage} src={profile.avatarUrl} alt="" />
                : <span onClick={profile.onClick} className={s.fallback}>{profile.name?.[0].toUpperCase()}</span>}
        </>
    )
}

export default ProfileIcon;