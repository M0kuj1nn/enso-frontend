import { useState } from 'react';

import { ChannelType } from './CreateChannelModal';

export const useNavigationModals = () => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [createChannelModal, setCreateChannelModal] = useState<{
    open: boolean;
    type: ChannelType;
  }>({ open: false, type: 'text' });

  return {
    isAddFriendOpen,
    isNewChatOpen,
    isCreateServerOpen,
    createChannelModal,
    openAddFriend: () => setIsAddFriendOpen(true),
    closeAddFriend: () => setIsAddFriendOpen(false),
    openNewChat: () => setIsNewChatOpen(true),
    closeNewChat: () => setIsNewChatOpen(false),
    openCreateServer: () => setIsCreateServerOpen(true),
    closeCreateServer: () => setIsCreateServerOpen(false),
    openCreateChannel: (type: ChannelType) =>
      setCreateChannelModal({ open: true, type }),
    closeCreateChannel: () =>
      setCreateChannelModal((v) => ({ ...v, open: false })),
  };
};
