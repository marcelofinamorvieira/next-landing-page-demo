'use client';

import Header from '@/components/Header';
import type { CommonLayoutQuery } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  globalPageProps: GlobalPageProps;
  data: CommonLayoutQuery;
};

/**
 * Client component that wraps the Header with post route detection
 * This isolates client-side rendering to just the Header component
 * and preserves server-side rendering for the rest of the layout
 */
const PostAwareHeader = ({ globalPageProps, data }: Props) => {
  const [isPostPage, setIsPostPage] = useState(false);
  const [currentSlug, setCurrentSlug] = useState('');
  const pathname = usePathname();
  const locale = globalPageProps.params.locale;

  useEffect(() => {
    // Create the regular expression pattern dynamically to correctly include the locale
    const patternString = `^/${locale}/posts/([^/]+)$`;
    const isPostPattern = new RegExp(patternString);
    const matchesPostPattern = isPostPattern.test(pathname);

    setIsPostPage(matchesPostPattern);

    if (matchesPostPattern) {
      const match = pathname.match(isPostPattern);
      if (match?.[1]) {
        setCurrentSlug(match[1]);
      }
    } else {
      setCurrentSlug('');
    }
  }, [pathname, locale]);

  return (
    <Header
      globalPageProps={globalPageProps}
      data={data}
      isPostPage={isPostPage}
      currentSlug={currentSlug}
    />
  );
};

export default PostAwareHeader;
