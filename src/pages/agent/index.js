import AgentFooter from "@/components/common/AgentFooter";
import AgentHeader from "@/components/common/AgentHeader";
import AgentHome from "@/components/sections/agent/AgentHome";

function AgentPage() {
  return (
    <>
      <AgentHeader />
      <AgentHome />
      <AgentFooter />
    </>
  );
}

AgentPage.disableDefaultLayout = true;

export default AgentPage;
