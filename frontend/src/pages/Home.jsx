import { Link } from "react-router-dom";
import Card from "../components/Card";
import Hero from "../components/Hero";
import Cta from "../components/Cta";
import { useBlogContext } from "../context/BlogContext";
import { useEffect } from "react";

const Home = () => {
  const { blogs } = useBlogContext();

  useEffect(() => {
    document.title = "liwotoBlogs";
  }, []);
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <Hero />

      {/* BLOG GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Latest Reads</h2>
          <Link
            to="/blogs"
            className="text-emerald-600 hover:underline font-medium"
          >
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs &&
            blogs
              .slice(0, 9)
              .map((blog) => <Card key={blog._id} blog={blog} />)}
        </div>
      </section>

      {/* CTA FOOTER */}
      <Cta />
    </div>
  );
};

export default Home;
