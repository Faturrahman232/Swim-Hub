// app/news/[id]/page.tsx - Detail Berita

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string };
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(
        "https://gnews.io/api/v4/search?q=swimming%20OR%20aquathlon%20Indonesia&lang=en&max=10&token=4cbace5f6dc17e27642d850f0ed1facb"
      );
      const data = await res.json();
      const selected = data.articles?.[parseInt(id as string)];
      if (selected) setArticle(selected);
      else router.push("/news");
    };
    fetchArticle();
  }, [id, router]);

  if (!article) {
    return <div className="p-6">Loading article...</div>;
  }

  return (
    <div className="container py-12">
      <Link
        href="/news"
        className="inline-flex items-center text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
      </Link>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        Source: {article.source.name} —{" "}
        {new Date(article.publishedAt).toLocaleString()}
      </div>
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="mb-4 rounded-md w-full object-cover"
        />
      )}

      <p className="text-lg text-gray-700 mb-6">
        {(article.content || article.description)
          ?.replace(/\.\.\. \[\d+ chars\]/, "...")
          .trim()}
      </p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Continue reading on {article.source.name} ↗
      </a>
    </div>
  );
}
