import PageSeo from "@/components/common/PageSeo";
import content from "@/content/portalContent.json";
import JobsMainSection from "../../components/sections/jobs/JobsFilterSection";

export default function JobsPage() {
  return <><PageSeo title={content["/jobs"].title} description={content["/jobs"].description} /><JobsMainSection /></>;
}

JobsPage.useDefaultLayout = true;
