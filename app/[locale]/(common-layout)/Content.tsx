import Footer from '@/components/Footer';
import PostAwareHeader from '../../../components/PostAwareHeader';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';

/**
 * Server component that renders the common layout for all pages in the (common-layout) group
 * The post detection logic is isolated in the PostAwareHeader client component
 * This pattern preserves server-side rendering for most of the page
 */
const Content: ContentPage<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  return (
    <>
      <PostAwareHeader 
        globalPageProps={globalPageProps} 
        data={data}
      />
      {children}
      <Footer globalPageProps={globalPageProps} data={data} />
    </>
  );
};

export default Content;
