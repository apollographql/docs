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
      href: 'https://www.apollographql.com/about-us',
      internal: true
    },
    {
      text: 'Careers',
      href: 'https://www.apollographql.com/careers',
      internal: true
    },
    {
      text: 'Open Positions',
      href: 'https://www.apollographql.com/careers#positions',
      internal: true
    },
    {
      text: 'Team',
      href: 'https://www.apollographql.com/careers/team',
      internal: true
    },
    {
      text: 'Leadership',
      href: 'https://www.apollographql.com/about-us',
      internal: true
    },
    {
      text: 'Interns',
      href: 'https://www.apollographql.com/careers/interns',
      internal: true
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
      href: 'https://www.apollographql.com/docs/apollo-client/'
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
      text: 'GraphQL Tutorial',
      href: 'https://odyssey.apollographql.com'
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
      href: 'https://www.apollographql.com/customers',
      internal: true
    },
    {
      text: 'Content Library',
      href: 'https://www.apollographql.com/resources',
      internal: true
    },
    {
      text: 'Apollo for Enterprise',
      href: 'https://www.apollographql.com/enterprise',
      internal: true
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
      href: 'https://www.apollographql.com/contact-sales',
      internal: true
    },
    {
      text: 'Get Support',
      href: 'https://www.apollographql.com/support',
      internal: true
    },
    {
      text: 'Website Terms of Service',
      href: 'https://www.apollographql.com/Apollo-Website-Terms-of-Service.pdf',
      internal: true
    },
    {
      text: 'Product Terms of Service',
      href: 'https://www.apollographql.com/Apollo-Terms-of-Service.pdf',
      internal: true
    },
    {
      text: 'Privacy Policy',
      href: 'https://www.apollographql.com/privacy-policy',
      internal: true
    }
  ]
};
