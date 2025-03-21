import type { SiteLocale } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { DocumentNode } from 'graphql';
import { gql } from 'graphql-tag';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * IMPORTANT: This API endpoint is part of a demonstration for handling localized slugs
 * and is only used by the posts page in this project.
 * 
 * This endpoint retrieves all available localized slugs for a specific post,
 * allowing the UI to offer language switching while maintaining the correct URL
 * path for each language variant of the post.
 */

// Define type for the response structure
type PostWithLocalizedSlugs = {
  id: string;
  _allSlugLocales?: Array<{
    locale: string;
    value: string;
  }>;
};

type GetPostBySlugQueryResult = {
  post?: PostWithLocalizedSlugs;
};

type GetPostBySlugVariables = {
  slug: string;
  locale: SiteLocale;
};

// GraphQL query using gql tag
const GetPostBySlugDocument = gql`
  query GetPostBySlug($slug: String, $locale: SiteLocale) {
    post(filter: { slug: { eq: $slug } }, locale: $locale) {
      id
      _allSlugLocales {
        locale
        value
      }
    }
  }
`;

/**
 * API route handler that fetches localized slugs for a post
 * Used by the language selector component to build proper URLs for each language
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const locale = url.searchParams.get('locale') as SiteLocale;

    if (!slug || !locale) {
      return NextResponse.json(
        { error: 'Missing required parameters: slug and locale' },
        { status: 400 },
      );
    }

    const data = await queryDatoCMS<GetPostBySlugQueryResult, GetPostBySlugVariables>(
      GetPostBySlugDocument as DocumentNode,
      {
        slug,
        locale,
      },
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching localized slugs:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 },
    );
  }
}
