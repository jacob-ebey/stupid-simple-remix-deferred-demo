import { Suspense } from "react";
import type { HeadersFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";

import { getArticles } from "~/models/articles.server";

export function loader() {
  const articles = getArticles(500);

  return defer(
    {
      articles,
    },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

export default function Index() {
  const { articles } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<ArticlesFallback />}>
      <Await resolve={articles}>
        {(articles) =>
          articles.map(({ id, description, title }) => (
            <div key={id} className="card">
              <h2>{title}</h2>
              <h5>{description}</h5>
              <img
                className="fakeimg"
                style={{ height: 200 }}
                src="https://placekitten.com/g/1200/500"
                alt="A cute cat picture in black and white"
              />
              <p>
                <Link to={`/blog/${id}`}>Read Article</Link>
              </p>
            </div>
          ))
        }
      </Await>
    </Suspense>
  );
}

function ArticlesFallback() {
  return (
    <div className="card">
      <h2>&nbsp;</h2>
      <h5>&nbsp;</h5>
      <div className="fakeimg" style={{ height: 200 }} />
      <p>&nbsp;</p>
    </div>
  );
}
