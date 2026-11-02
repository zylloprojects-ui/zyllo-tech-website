import Seo from "@/components/Seo";
import EmployeePortal from "@/pages/EmployeePortal";

export default function AdminEmployeePage() {
  return (
    <>
      <Seo title="Employee Workspace — Admin Command" noindex />
      <div className="w-full">
        <EmployeePortal insideAdmin={true} />
      </div>
    </>
  );
}
