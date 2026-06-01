'use client';

import { createContext } from 'react';

import { useContextWrapper } from '@shared/utils';

export interface ChatDetailsContextValue {
  isDetailsOpen: boolean;
  openDetails: () => void;
  closeDetails: () => void;

  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

export const ChatDetailsContext = createContext<
  ChatDetailsContextValue | undefined
>(undefined);

export const useChatDetailsContext = () =>
  useContextWrapper(ChatDetailsContext);
