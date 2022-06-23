import type {
  Deferrable,
  HeadersFunction,
  LoaderFunction,
} from "@remix-run/node";
import { deferred } from "@remix-run/node";
import { Deferred, useDeferred, useLoaderData } from "@remix-run/react";

import { getArticle } from "~/models/articles.server";

type LoaderData = {
  article: Deferrable<ReturnType<typeof getArticle>>;
};

export const loader: LoaderFunction = ({ params: { id } }) => {
  const article = getArticle(id!);

  return deferred(
    { article },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

export default function BlogPost() {
  const { article } = useLoaderData();

  return (
    <Deferred value={article} fallback={<ArticleFallback />}>
      <Article />
    </Deferred>
  );
}

function ArticleFallback() {
  return <article className="card" style={{ height: "90vh" }} />;
}

function Article() {
  const article = useDeferred<LoaderData["article"]>();

  return (
    <main>
      <article
        className="card"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </main>
  );
}
