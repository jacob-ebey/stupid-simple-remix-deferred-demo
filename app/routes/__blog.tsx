import { deferred } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import {
  Deferred,
  Link,
  Outlet,
  useDeferred,
  useLoaderData,
} from "@remix-run/react";

import { getArticles } from "~/models/articles.server";

export const loader: LoaderFunction = () => {
  const popularArticles = getArticles(1000);

  return deferred(
    {
      popularArticles,
    },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
};

export default function BlogLayout() {
  const { popularArticles } = useLoaderData();

  return (
    <div className="row">
      <main className="leftcolumn">
        <Outlet />
      </main>
      <aside className="rightcolumn">
        <Deferred data={popularArticles} fallback={<PopularArticlesFallback />}>
          <PopularArticles />
        </Deferred>

        <div className="card">
          <h2>About Me</h2>
          <div className="fakeimg" style={{ height: 100 }}>
            Image
          </div>
          <p>Some text about me in culpa qui officia deserunt mollit anim..</p>
        </div>

        <div className="card">
          <h3>Follow Me</h3>
          <p>Some text..</p>
        </div>
      </aside>
    </div>
  );
}

function PopularArticlesFallback() {
  return (
    <div className="card">
      <h3>Popular Articles</h3>
      <div className="fakeimg">
        <p>&nbsp;</p>
      </div>
      <div className="fakeimg">
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

function PopularArticles() {
  let articles = useDeferred() as Awaited<ReturnType<typeof getArticles>>;

  return (
    <div className="card">
      <h3>Popular Articles</h3>
      {articles.map(({ id, title }) => (
        <div
          key={id}
          className="fakeimg"
          style={{
            backgroundImage: `url(https://placekitten.com/g/400/200)`,
            backgroundPosition: "top",
          }}
        >
          <p>
            <Link to={`/blog/${id}`}>{title}</Link>
          </p>
        </div>
      ))}
    </div>
  );
}
