import type { HeadersFunction, LoaderArgs } from "@remix-run/node";
import { deferred } from "@remix-run/node";
import { Deferred, useDeferredData, useLoaderData } from "@remix-run/react";

import { getArticle } from "~/models/articles.server";

type LoaderData = {
  article: ReturnType<typeof getArticle>;
};

export function loader({ params: { id } }: LoaderArgs) {
  const article = getArticle(id!);

  return deferred<LoaderData>(
    { article },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

export default function BlogPost() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <Deferred value={article} fallbackElement={<ArticleFallback />}>
      <Article />
    </Deferred>
  );
}

function ArticleFallback() {
  return <article className="card" style={{ height: "90vh" }} />;
}

function Article() {
  const article = useDeferredData<LoaderData["article"]>();

  return (
    <main>
      <article
        className="card"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </main>
  );
}
