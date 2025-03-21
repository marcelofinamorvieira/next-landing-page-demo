'use client';

import type { GlobalPageProps } from '@/utils/globalPageProps';
import { usePathname } from 'next/navigation';

type Props = {
  globalPageProps: GlobalPageProps;
  onRouteInfo: (info: { isPostPage: boolean; currentSlug: string }) => void;
};

/**
 * Client component that detects if the current route is a post page
 * and provides this information to the parent component via a callback.
 * 
 * This isolates the client-side routing logic to prevent unnecessary
 * client-side rendering of the entire common layout.
 */
const PostRouteDetector = ({ globalPageProps, onRouteInfo }: Props) => {
  // Get the current pathname to detect if we're on a post page
  const pathname = usePathname();
  const locale = globalPageProps.params.locale;
  
  // Create the regular expression pattern dynamically to correctly include the locale
  const patternString = `^/${locale}/posts/([^/]+)$`;
  const isPostPattern = new RegExp(patternString);
  const isPostPage = isPostPattern.test(pathname);

  // Extract the slug if we're on a post page
  let currentSlug = '';
  if (isPostPage) {
    const match = pathname.match(isPostPattern);
    if (match?.[1]) {
      currentSlug = match[1];
    }
  }

  // Call the callback with the route information
  onRouteInfo({ isPostPage, currentSlug });
  
  // Return null as this component doesn't render anything
  return null;
};

export default PostRouteDetector;
