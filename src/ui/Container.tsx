import { cva } from 'class-variance-authority';
import { ve } from '@shared/utils/VariantElementsFactory.utils';
import { tc } from '@shared/utils/TComponentFactory.utils';

export const Container = ve(
  tc('div'),
  cva('base-container p-2 gap-2', {
    variants: {
      flow: {
        col: 'flex-col',
      },
      items: {
        centered: 'items-centered',
        start: 'items-start-centered',
      },
      divideY: {
        1: 'divide-y-1',
      },
      divideYColor: {
        main: 'dark:divide-dark-300 divide-light-300',
      },
      border: {
        main: 'dark:border-dark-300 border-light-300',
        indigo: 'border-indigo-400',
      },
      bg: {
        white: 'dark:bg-dark-400 bg-white',
        'light-200': 'dark:bg-dark-500 bg-light-200',
        'light-300': 'dark:bg-dark-500/40 bg-light-300/40',
      },
      outline: {
        indigo: 'hover:outline-indigo-400 outline-indigo-400',
      },
      text: {
        black: 'dark:text-white text-black',
        'dark-300': 'dark:text-light-300 text-dark-300',
        'light-500': 'dark:text-dark-100 text-light-500',
      },
      textSize: {
        md: 'text-md',
        xl: 'text-xl',
      },
      position: {
        'absolute-center': 'absolute-center',
        'absolute-bottom': 'absolute-bottom',
        'absolute-left': 'absolute top-0 left-0',
      },
      glowD: {
        indigo: 'hover:drop-shadow-indigo-400/80 drop-shadow-transparent',
      },
      glowDSize: {
        md: 'drop-shadow-[0_0_4px_rgba(0,0,0,0)]',
      },
      transition: { none: 'transition-none' },
      shadow: {
        sm: 'shadow-sm shadow-black/50',
      },
      scrollBar: {
        none: 'no-scrollbar',
      },
      rounded: {
        md: 'rounded-md',
        full: 'rounded-full',
      },
      scale: {
        0: 'hover:scale-100',
        5: 'hover:scale-101',
      },
      translateY: {
        0: 'hover:[transform:translate3d(0,0,0)]',
        5: 'hover:[transform:translate3d(0,-0.25rem,0)]',
      },
    },
    defaultVariants: {
      text: 'dark-300',
    },
    compoundVariants: [
      { divideYColor: 'main', className: 'divide-y-1' },
      { border: ['main', 'indigo'], className: 'border-1' },
      {
        outline: 'indigo',
        className: 'hover:outline-1',
      },
    ],
  })
);
