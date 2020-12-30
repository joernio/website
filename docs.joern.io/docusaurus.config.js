const path = require('path');

module.exports = {
  title: 'Joern Documentation',
  tagline: 'The Bug Hunter\'s Workbench',
  url: 'https://docs.joern.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'joernio',
  projectName: 'joernio.github.io',
  themeConfig: {
    colorMode : {
      defaultMode : 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Joern Documentation',
      logo: {
        alt: 'Joern Logo',
        src: 'img/website-icon.png',
	href: '/home',
        target: '_self'
      },
      items: [
      ],
    },
    footer: {
      links: [
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Joern Project. Built with Docusaurus.`,
    },
  },
  plugins: [
    require.resolve('docusaurus-lunr-search'),
    path.resolve(__dirname, 'plugins/staticcode')
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
	  routeBasePath: '/',
          // Please change this to your repo.
          editUrl:
            'https://github.com/joernio/website/edit/master/docs.joern.io/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
