import { useEffect } from 'react';
const appIcon = '/icons/AppIcon.png';
export function PWAHead() {
  useEffect(() => {
    // 1. Update Favicon and Apple Touch Icon
    const updateIcons = () => {
      const links = [
        { rel: 'icon', href: appIcon },
        { rel: 'apple-touch-icon', href: appIcon },
      ];

      links.forEach(({ rel, href }) => {
        let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = href;
      });
    };

    // 2. Inject Manifest
    const injectManifest = () => {
      const manifest = {
        name: 'Moove',
        short_name: 'Moove',
        display: 'standalone',
        start_url: '/',
        background_color: '#09090b', // zinc-950
        theme_color: '#09090b',
        icons: [
          {
            src: appIcon,
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: appIcon,
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      };

      const stringManifest = JSON.stringify(manifest);
      const blob = new Blob([stringManifest], { type: 'application/json' });
      const manifestUrl = URL.createObjectURL(blob);

      let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'manifest';
        document.head.appendChild(link);
      }
      link.href = manifestUrl;
    };
    
    // 3. Update Meta Tags for iOS
    const updateMeta = () => {
        const metas = [
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'apple-mobile-web-app-title', content: 'Moove' },
            { name: 'theme-color', content: '#09090b' },
        ];
        
        metas.forEach(({ name, content }) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        });
    };

    updateIcons();
    injectManifest();
    updateMeta();

  }, []);

  return null;
}
