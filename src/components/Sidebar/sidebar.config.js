import React from 'react';
// icons
import {AiOutlineHome} from 'react-icons/ai';

export const sidebarMenu = {
  categories: [
    {
      name: 'START',
      items: [
        {
          title: 'Home',
          docset: 'mock-docset',
          icon: AiOutlineHome
        },
        {
          title: 'Your Apollo Journey',
          docset: 'mock-docset-2',
          icon: AiOutlineHome
        }
      ]
    },
    {
      name: 'GRAPHOS',
      items: [
        {
          title: 'Building Graphs',
          docset: 'graphos',
          icon: AiOutlineHome
        },
        {
          title: 'Metrics',
          docset: 'mock-docset-3',
          icon: AiOutlineHome
        },
        {
          title: 'Security',
          docset: 'mock-docset-4',
          icon: AiOutlineHome
        },
        {
          title: 'Federation',
          docset: 'federation',
          icon: AiOutlineHome
        },
        {
          title: 'Org Management',
          docset: 'mock-docset-5',
          icon: AiOutlineHome
        },
        {
          title: 'Enterprise Features',
          docset: 'mock-docset-6',
          icon: AiOutlineHome
        },
        {
          title: 'Tech Notes',
          docset: 'technotes',
          icon: AiOutlineHome
        }
      ]
    },
    {
      name: (
        <div>
          TOOLS <span className="hide-when-closed">& LIBRARIES</span>
        </div>
      ),
      items: [
        {
          title: 'Rover CLI',
          docset: 'rover',
          icon: AiOutlineHome
        },
        {
          title: 'Apollo Router',
          docset: 'router',
          icon: AiOutlineHome
        },
        {
          title: 'Apollo Server',
          docset: 'apollo-server',
          icon: AiOutlineHome
        },
        {
          title: 'Client (React / JS)',
          docset: 'react',
          icon: AiOutlineHome
        },
        {
          title: 'Client (Kotlin)',
          docset: 'kotlin',
          icon: AiOutlineHome
        },
        {
          title: 'Client (iOS)',
          docset: 'ios',
          icon: AiOutlineHome
        }
      ]
    }
  ]
};

export const mockDocset = {
  'mock-docset': {
    docset: 'Mock Docset',
    navItems: [
      {
        title: 'nav item 1',
        path: '/'
      },
      {
        title: 'nav item 2',
        path: '/'
      },
      {
        title: 'nav item 3',
        path: '/'
      }
    ]
  },
  'mock-docset-2': {
    docset: 'Mock Docset 2',
    navItems: [
      {
        title: 'nav item 1',
        path: '/'
      },
      {
        title: 'nav item 2',
        path: '/'
      },
      {
        title: 'nav item 3',
        path: '/'
      }
    ]
  },
  'mock-docset-3': {
    docset: 'Mock Docset 3',
    navItems: [
      {
        title: 'nav item 1',
        path: '/'
      },
      {
        title: 'nav item 2',
        path: '/'
      },
      {
        title: 'nav item 3',
        path: '/'
      }
    ]
  },
  'mock-docset-4': {
    docset: 'Mock Docset 4',
    navItems: [
      {
        title: 'nav item 1',
        path: '/'
      },
      {
        title: 'nav item 2',
        path: '/'
      },
      {
        title: 'nav item 3',
        path: '/'
      }
    ]
  },
  'mock-docset-5': {
    docset: 'Mock Docset 5',
    navItems: [
      {
        title: 'nav item 1',
        path: '/'
      },
      {
        title: 'nav item 2',
        path: '/'
      },
      {
        title: 'nav item 3',
        path: '/'
      }
    ]
  },
  'mock-docset-6': {
    docset: 'Mock Docset 6',
    navItems: [
      {
        title: 'nav item 1',
        path: '/'
      },
      {
        title: 'nav item 2',
        path: '/'
      },
      {
        title: 'nav item 3',
        path: '/'
      }
    ]
  }
};
