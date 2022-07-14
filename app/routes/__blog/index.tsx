import type { HeadersFunction } from "@remix-run/node";
import { deferred } from "@remix-run/node";
import { Deferred, Link, useLoaderData } from "@remix-run/react";

import { getArticles } from "~/models/articles.server";

export function loader() {
  const articles = getArticles(500);

  return deferred(
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
    <Deferred value={articles} fallbackElement={<ArticlesFallback />}>
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
    </Deferred>
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
