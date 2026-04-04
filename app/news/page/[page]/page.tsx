import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Article {
  title: string;
  description: string;
  url: string;
  image: string;
  published_at: string;
  source: string;
}

async function fetchArticles(offset: number): Promise<Article[]> {
  const res = await fetch(
    `https://api.mediastack.com/v1/news?access_key=9b07eff34ae175f6900d18ef4bbd00be&keywords=swimming&limit=100&offset=${offset}`
  );

  const json = await res.json();

  const filtered = json.data
    .filter((a: Article) => a.image)
    .filter(
      (article: { title: any }, index: any, self: any[]) =>
        self.findIndex((a: { title: any }) => a.title === article.title) ===
        index
    )
    .slice(0, 10);

  return filtered;
}

export default async function NewsPage({
  params,
}: {
  params: { page: string };
}) {
  const page = parseInt(params.page, 10) || 1;
  const offset = (page - 1) * 100; // Server returns 100, kita ambil 10 teratas
  const articles = await fetchArticles(offset);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Latest Swimming News
      </h1>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">No news found.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Card
                key={index}
                className="shadow hover:shadow-lg transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {article.title.length > 80
                      ? article.title.slice(0, 80) + "..."
                      : article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between">
                  <p className="text-sm mb-3">
                    {article.description?.slice(0, 100)}...
                  </p>
                  <div className="text-xs text-gray-500 mb-2">
                    Source: {article.source} —{" "}
                    {new Date(article.published_at).toLocaleDateString()}
                  </div>
                  <Link
                    href={article.url}
                    target="_blank"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-10">
            <Button variant="outline" disabled={page === 1} asChild>
              <Link href={`/news/page/${page - 1}`}>Previous</Link>
            </Button>
            <span className="text-gray-600 font-medium">Page {page}</span>
            <Button variant="outline" asChild>
              <Link href={`/news/page/${page + 1}`}>Next</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
