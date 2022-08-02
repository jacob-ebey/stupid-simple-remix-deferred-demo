type GithubMdFile = {
  path: string;
  sha: string;
};

type GithubMd = {
  attributes: { title: string; description: string };
  html: string;
};

type ArticlePreview = {
  id: string;
  title: string;
  description: string;
};

type Article = {
  id: string;
  title: string;
  description: string;
  html: string;
};

export async function getArticle(
  id: string,
  delay: number = 500
): Promise<Article> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  let post: GithubMd = await fetch(
    `https://github-md.com/jacob-ebey/remix-blog-example-content/main/routes/blog/${id}.md`
  ).then((response) => response.json());

  return {
    ...post.attributes,
    id: id,
    html: post.html,
  };
}

export async function getArticles(
  delay: number = 500
): Promise<ArticlePreview[]> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  let json: { files: GithubMdFile[] } = await fetch(
    "https://github-md.com/jacob-ebey/remix-blog-example-content/main"
  ).then((response) => response.json());

  let files = json.files
    .filter((file) => file.path.startsWith("routes/blog/"))
    .slice(0, 2);

  let posts: GithubMd[] = await Promise.all(
    files.map((file) =>
      fetch(
        `https://github-md.com/jacob-ebey/remix-blog-example-content/main/${file.path}`
      ).then((response) => response.json())
    )
  );

  let articles = posts.map<ArticlePreview>((post, index) => {
    return {
      ...post.attributes,
      id: files[index].path.split("/").pop()!.replace(/\.md$/, ""),
    };
  });

  return articles;
}
