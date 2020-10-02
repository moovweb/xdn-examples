import {_shopifyCustomClient} from '../../index';
import { Article } from "../../types";
import { blogsQuery } from "./buildQueries";

async function fetchByHandle(options): Promise<Article> {

    const blog = await _shopifyCustomClient.graphQLClient
        .send(blogsQuery(options.slug))
        .then(({model}) => {
            return model;
        });

    return blog;
}

export default fetchByHandle;
