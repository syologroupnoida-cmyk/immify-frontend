import Link from "next/link";
import { vendorCategories } from "../../components/sections/home/homeData";

export async function getStaticPaths() {
  const paths = vendorCategories.map((category) => ({ params: { slug: category.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const category = vendorCategories.find((item) => item.slug === params.slug);

  if (!category) {
    return { notFound: true };
  }

  return {
    props: { category },
  };
}

function CategoryDetailPage({ category }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-sky-700">
          ← Back to home
        </Link>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">Category detail</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">{category.title}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">{category.summary}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {category.tags.map((tag) => (
                  <div key={tag} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {tag}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-2xl font-semibold text-slate-900">What this category covers</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Discover top suppliers, services, and solutions tied to this category. This page helps buyers explore relevant options, compare benefits, and connect with reliable vendors.
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Popular tags</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {category.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Get started</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Post your requirement and connect with trusted vendors in this category.
                </p>
                <button className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Post your requirement
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

CategoryDetailPage.useDefaultLayout = true;

export default CategoryDetailPage;
