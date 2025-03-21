import getAvailableLocales from '@/app/i18n/settings';
import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import { PostStaticParamsDocument } from '@/graphql/types/graphql';
import type { SiteLocale } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { DocumentNode } from 'graphql';
import Content from './Content';
import RealTime from './RealTime';
import { query } from './meta';
import type { PageProps, Query, Variables } from './meta';

/**
 * IMPORTANT: This localized slug approach is implemented as a demonstration
 * and only applies to the posts page in this project. Other pages use different
 * localization approaches.
 * 
 * The implementation shows how to handle locale-specific URL slugs where the same
 * content might have different URL paths in different languages.
 */

// Define type for the posts with localized slugs (not included in the generated types)
interface PostWithLocalizedSlugs {
  slug: string; // Base type from the query
  _allSlugLocales?: Array<{
    locale: string;
    value: string;
  }>;
}

export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  const allParams: Array<PageProps['params']> = [];

  for (const locale of locales) {
    // Create variables that will work with PostStaticParamsDocument
    // We need to cast our document to accept the locale parameters 
    const data = await queryDatoCMS<
      { allPosts: PostWithLocalizedSlugs[] }, 
      { locale: SiteLocale; fallbackLocale: SiteLocale[] }
    >(PostStaticParamsDocument as DocumentNode, {
      locale: locale as SiteLocale,
      fallbackLocale: locales.filter((l) => l !== locale) as SiteLocale[],
    });

    // Process each post to extract locale-specific slugs
    // This allows posts to have different URL paths in different languages
    // For example, a post could be /posts/hello-world in English and /posts/hola-mundo in Spanish
    for (const post of data.allPosts) {
      const slugLocale = post._allSlugLocales?.find(
        (sl) => sl.locale === locale,
      );

      if (slugLocale?.value) {
        allParams.push({
          slug: slugLocale.value,
          locale,
        });
      }
    }
  }

  return allParams;
}

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.locale,
  fallbackLocale: [fallbackLocale],
  slug: params.slug,
});

export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables,
    generate: (data: Query) => data.post?.seo,
  },
);

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
