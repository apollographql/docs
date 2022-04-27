export interface Link {
  text: string;
  href: string;
  internal?: boolean;
}

export interface Category {
  title: string;
  links: Link[];
}

export const companyCategory: Category = {
  title: 'Company',
  links: [
    {
      text: 'About Us',
      href: 'https://www.apollographql.com/about-us'
    },
    {
      text: 'Careers',
      href: 'https://www.apollographql.com/careers'
    },
    {
      text: 'Open Positions',
      href: 'https://www.apollographql.com/careers#positions'
    },
    {
      text: 'Team',
      href: 'https://www.apollographql.com/careers/team'
    },
    {
      text: 'Leadership',
      href: 'https://www.apollographql.com/about-us'
    },
    {
      text: 'Interns',
      href: 'https://www.apollographql.com/careers/interns'
    }
  ]
};

export const productCategory: Category = {
  title: 'Product',
  links: [
    {
      text: 'Apollo Studio',
      href: 'https://www.apollographql.com/docs/studio/'
    },
    {
      text: 'Apollo Federation',
      href: 'https://www.apollographql.com/docs/federation/'
    },
    {
      text: 'Apollo Client',
      href: 'https://www.apollographql.com/docs/react/'
    },
    {
      text: 'Apollo Server',
      href: 'https://www.apollographql.com/docs/apollo-server/'
    },
    {
      text: 'Tooling',
      href: 'https://www.apollographql.com/docs/devtools/cli/'
    }
  ]
};

export const communityCategory: Category = {
  title: 'Community',
  links: [
    {
      text: 'GraphQL Tutorials',
      href: 'https://www.apollographql.com/tutorials'
    },
    {
      text: 'GraphQL Summit',
      href: 'https://summit.graphql.com'
    },
    {
      text: 'Apollo Community',
      href: 'https://community.apollographql.com'
    },
    {
      text: 'Blog',
      href: 'https://blog.apollographql.com'
    },
    {
      text: 'DevHub',
      href: 'https://www.apollographql.com/developers'
    },
    {
      text: 'Graph Champions',
      href: 'https://www.apollographql.com/events/champions-corner/welcome/'
    },
    {
      text: 'Contribute',
      href: 'https://www.apollographql.com/docs/community/contributing/'
    }
  ]
};

export const whyApolloCategory: Category = {
  title: 'Why Apollo?',
  links: [
    {
      text: 'Customer Stories',
      href: 'https://www.apollographql.com/customers'
    },
    {
      text: 'Content Library',
      href: 'https://www.apollographql.com/resources'
    },
    {
      text: 'Apollo for Enterprise',
      href: 'https://www.apollographql.com/enterprise'
    },
    {
      text: 'Events at Apollo',
      href: 'https://www.apollographql.com/events/'
    }
  ]
};

export const helpCategory: Category = {
  title: 'Help',
  links: [
    {
      text: 'Contact an Expert',
      href: 'https://www.apollographql.com/contact-sales'
    },
    {
      text: 'Get Support',
      href: 'https://www.apollographql.com/support'
    },
    {
      text: 'Website Terms of Service',
      href: 'https://www.apollographql.com/Apollo-Website-Terms-of-Service.pdf'
    },
    {
      text: 'Product Terms of Service',
      href: 'https://www.apollographql.com/Apollo-Terms-of-Service.pdf'
    },
    {
      text: 'Privacy Policy',
      href: 'https://www.apollographql.com/privacy-policy'
    }
  ]
};

export const defaultConfig = [
  communityCategory,
  companyCategory,
  helpCategory,
  productCategory,
  whyApolloCategory
];
