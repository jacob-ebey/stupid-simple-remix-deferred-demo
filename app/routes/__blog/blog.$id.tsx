import { Suspense } from "react";
import type { HeadersFunction, LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, useAsyncValue, useLoaderData } from "@remix-run/react";

import { getArticle } from "~/models/articles.server";

type LoaderData = {
  article: ReturnType<typeof getArticle>;
};

export function loader({ params: { id } }: LoaderArgs) {
  const article = getArticle(id!);

  return defer<LoaderData>(
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
  const article = useAsyncValue() as Awaited<LoaderData["article"]>;

  return (
    <main>
      <article
        className="card"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </main>
  );
}
