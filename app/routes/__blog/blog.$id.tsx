import { Suspense } from "react";
import type { HeadersFunction, LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import type { UseDataFunctionReturn } from "@remix-run/react";
import { Await, useAsyncValue, useLoaderData } from "@remix-run/react";

import { getArticle } from "~/models/articles.server";

export function loader({ params: { id } }: LoaderArgs) {
  const article = getArticle(id!);

  return defer(
    { article },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

export default function BlogPost() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<ArticleFallback />}>
      <Await resolve={article}>
        <Article />
      </Await>
    </Suspense>
  );
}

function ArticleFallback() {
  return <article className="card" style={{ height: "90vh" }} />;
}

function Article() {
  const article =
    useAsyncValue<UseDataFunctionReturn<typeof loader>["article"]>();

  return (
    <main>
      <article
        className="card"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </main>
  );
}
