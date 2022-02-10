import type { IUser, UserRole } from '@typings/objects';

const levels: Record<UserRole, number> = {
    user: 0,
    moderator: 5,
    admin: 10,
};

export default function hasUserRights(user: IUser, role: UserRole): boolean {
    return levels[user.role] >= levels[role];
}
