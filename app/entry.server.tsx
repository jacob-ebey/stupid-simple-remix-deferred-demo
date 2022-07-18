import { PassThrough } from "stream";
// import { renderToPipeableStream } from "react-dom/server";
import { renderToStream } from "react-streaming/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import { Response, Headers } from "@remix-run/node";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const { pipe } = await renderToStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      seoStrategy: "google-speed",
      userAgent: request.headers.get("User-Agent") || undefined,
      onBoundaryError(error) {
        responseStatusCode = 500;
        console.error(error);
      },
    }
  );

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("Connection", "keep-alive");
  responseHeaders.set("Content-Encoding", "chunked");
  responseHeaders.set("Transfer-Encoding", "chunked");

  const body = new PassThrough();
  pipe!(body);
  return new Response(body, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
