import { useEffect } from 'react';

export default function useSEO({ title, description, noindex }) {
  useEffect(() => {
    // 1. Update title
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} | Benmarket Express`;
    }

    // 2. Update description
    let metaDescription = document.querySelector('meta[name="description"]');
    let createdDesc = false;
    const prevDesc = metaDescription ? metaDescription.getAttribute('content') : '';

    if (description) {
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
        createdDesc = true;
      }
      metaDescription.setAttribute('content', description);
    }

    // 3. Update robots noindex/nofollow
    let metaRobots = document.querySelector('meta[name="robots"]');
    let createdRobots = false;

    if (noindex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
        createdRobots = true;
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    }

    // Cleanup when component unmounts to restore previous tags or remove temporary tags
    return () => {
      document.title = prevTitle;
      if (createdDesc && metaDescription) {
        metaDescription.remove();
      } else if (metaDescription && prevDesc) {
        metaDescription.setAttribute('content', prevDesc);
      }

      if (createdRobots && metaRobots) {
        metaRobots.remove();
      } else if (metaRobots && !noindex) {
        metaRobots.remove();
      }
    };
  }, [title, description, noindex]);
}
