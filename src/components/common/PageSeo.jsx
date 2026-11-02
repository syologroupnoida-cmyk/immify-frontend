import Head from "next/head";

export default function PageSeo({ title, description }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
    </Head>
  );
}
