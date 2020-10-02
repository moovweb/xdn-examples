import { getArticle } from '@vue-storefront/shopify-api';
import { Article } from "@vue-storefront/shopify-api/src/types";

interface UseArticle<ARTICLE, ARTICLE_PARAMS> {
    articles: () => Promise<ARTICLE[]>,
    loadArticle: (handle: string) => Promise<ARTICLE>,
    loadNext: (cursor: string) => Promise<ARTICLE[]>
}

const params : UseArticle<Article, any> = {

    articles: async () => {
        return await getArticle.fetchAll({ pages: 10 });
    },

    loadArticle: async (handle) => {
        return await getArticle.fetchByHandle({ slug: handle });
    },

    loadNext: async (cursor) => {
        return await getArticle.fetchNext({ pages: 10, cursor: cursor });
    }
};

const useArticle: () => UseArticle<Article, any> = () => params;

export default useArticle;
