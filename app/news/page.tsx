import NewsPage from "./page/[page]/page";

export default function DefaultNewsPage() {
  return <NewsPage params={{ page: "1" }} />;
}
