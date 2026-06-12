import { FriendState, Relationship } from '@shared/types/chat';

// Вычисляет UI-статус дружбы относительно текущего пользователя.
// Бэк отдаёт только Relationship (sender_id/receiver_id/status) - направление
// заявки ('исходящая'/'входящая') фронт определяет сам, сравнивая sender_id с currentUserId.
export const getFriendState = (
  relationship: Relationship | undefined,
  currentUserId: string,
): FriendState => {
  if (!relationship) return 'none';
  if (relationship.status === 'accepted') return 'friends';
  if (relationship.status === 'blocked') return 'blocked';
  return relationship.sender_id === currentUserId
    ? 'pending_out'
    : 'pending_in';
};
