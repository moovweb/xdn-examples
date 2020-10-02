import { _shopifyCustomClient } from '../../index';

const articlesQuery: (pages: number, cursor?: string) => any = (
  pages,
  cursor = ''
): any => {
  return _shopifyCustomClient.graphQLClient.query((root) => {
    const args: any = { first: pages };
    if (cursor) {
      args.after = cursor;
    }

    root.addConnection('articles', { args: args }, (article) => {
      article.add('title');
      article.add('excerptHtml');
      article.add('handle');
      article.add('publishedAt');
      article.add('authorV2', (author) => {
        author.add('name');
      });
      article.add('image', (image) => {
        image.add('altText');
        image.add('originalSrc');
      });
    });
  });
};

const blogsQuery: (slug: string) => any = (slug): any => {
  return _shopifyCustomClient.graphQLClient.query((root) => {
    root.addConnection('blogs', { args: { first: 1 } }, (blog) => {
      blog.add(
        'articleByHandle',
        {
          args: {
            handle: slug
          }
        },
        (article) => {
          article.add('id');
          article.add('content');
          article.add('contentHtml');
          article.add('excerpt');
          article.add('excerptHtml');
          article.add('handle');
          article.add('image', (options) => {
            options.add('altText');
            options.add('originalSrc');
          });
          article.add('publishedAt');
          article.add('seo', (options) => {
            options.add('title');
            options.add('description');
          });
          article.add('authorV2', (author) => {
            author.add('name');
          });
          article.add('tags');
          article.add('title');
          article.add('url');
        }
      );
    });
  });
};

export { articlesQuery, blogsQuery };
