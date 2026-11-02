import Seo from "@/components/Seo";
import ClientPortal from "@/pages/ClientPortal";

export default function AdminClientPage() {
  return (
    <>
      <Seo title="Client Workspace — Admin Command" noindex />
      <div className="w-full">
        <ClientPortal insideAdmin={true} />
      </div>
    </>
  );
}
