import Seo from "@/components/Seo";
import HrPortal from "@/pages/HrPortal";

export default function AdminHrPage() {
  return (
    <>
      <Seo title="HR Operations — Admin Command" noindex />
      <div className="w-full">
        <HrPortal insideAdmin={true} />
      </div>
    </>
  );
}
