function ErrorPage({ statusCode }) {
  const title = statusCode
    ? `An error ${statusCode} occurred on server`
    : 'An error occurred on client';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          {statusCode || 'Error'}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm text-slate-600">
          Please refresh the page or return to the homepage.
        </p>
      </section>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
