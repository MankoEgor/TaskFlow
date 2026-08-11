export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

export type BoardRole = 'owner' | 'member';

export type BoardMember = Profile & {
  role: BoardRole;
};
