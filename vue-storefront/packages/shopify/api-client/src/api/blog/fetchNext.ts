import {_shopifyCustomClient} from '../../index';
import { Article } from "../../types";
import { articlesQuery } from "./buildQueries";

/**
 * Fetches all cms pages on the shop.
 * @return {Promise|Content}
 */
async function fetchNext(options): Promise<Article[]> {

    const blogs = await _shopifyCustomClient.graphQLClient
        .send(articlesQuery(options.pages, options.cursor))
        .then(({model}) => {
            return model;
        });

    return blogs;
}

export default fetchNext;
