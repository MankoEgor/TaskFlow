import { useNavigate } from 'react-router-dom';
import type { BoardMember } from '../../../types/members.type';

import Button from "../../../components/shared/Button/Button";
import ProfileIcon from '../../../components/shared/ProfileIcon/ProfileIcon';

import addIcon from '../../../assets/add.svg';
import backIcon from '../../../assets/arrow_back.svg';
import deleteIcon from '../../../assets/delete.svg'

import s from './BoardHeader.module.css';

interface BoardHeaderProps {
    boardTitle: string;
    members: BoardMember[];
    isMembersLoading: boolean;
    isOwner: boolean;
    isRemoving: boolean;
    setIsInviteClicked: (value: boolean) => void;
    handleRemoveMember: (memberId: string, memberName: string | null) => void;
}

function BoardHeader({ 
        boardTitle, 
        members, 
        isMembersLoading, 
        isOwner, 
        isRemoving, 
        setIsInviteClicked, 
        handleRemoveMember 
    }: BoardHeaderProps) {

    const navigate = useNavigate();

    return (
        <div className={s.header}>
            <div className={s.navigation}>
                <Button 
                    message="Back"
                    icon={backIcon}
                    onClick={() => navigate('/board')}
                />

                <h1>{boardTitle}</h1>


            </div>

            <div className={s.memberDiv}>
                {isMembersLoading ? null : members.map((member) => (
                    <div className={s.memberItem} key={member.id}>
                        <ProfileIcon
                            name={member.name ?? 'Unknown user'}
                            avatarUrl={member.avatar_url}
                        />


                        {isOwner && member.role !== 'owner' && (
                            <button
                                className={s.removeMemberButton}
                                type="button"
                                title={`Remove ${member.name ?? 'member'}`}
                                aria-label={`Remove ${member.name ?? 'member'}`}
                                disabled={isRemoving}
                                onClick={() => handleRemoveMember(member.id, member.name)}>
                                    <img
                                        className={s.removeMemberIcon}
                                        src={deleteIcon}
                                        alt=""/>
                            </button>
                        )}
                    </div>
                ))}

                {isOwner && (
                    <button className={s.addMember} onClick={() => setIsInviteClicked(true)}>
                        <img className={s.addMemberIcon} src={addIcon} alt="Invite Member" />
                        <p className={s.addMemberText}>Invite</p>
                    </button>
                )}
            </div>

        </div>
    )
    
}

export default BoardHeader;