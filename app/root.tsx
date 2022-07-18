import * as React from "react";
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useTransition,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import globalStylesHref from "./styles/global.css";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: nProgressStyles },
  { rel: "stylesheet", href: globalStylesHref },
];

export default function App() {
  let transition = useTransition();

  React.useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (transition.state !== "idle") NProgress.start();
    // when the state is idle then we can to complete the progress bar
    else NProgress.done();

    return () => {
      NProgress.done();
    };
  }, [transition.state]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <div className="header">
            <h1>Remix Deferred</h1>
          </div>

          <nav className="topnav">
            <Link to="/">Blog</Link>
            <a href="#">Link</a>
            <a href="#" style={{ float: "right" }}>
              Link
            </a>
          </nav>
        </header>

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
