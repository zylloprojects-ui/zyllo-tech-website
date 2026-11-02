// src/admin/pages/ProjectTrackerPage.jsx
// Enterprise Project Tracker page for Zyllo Tech Admin Console

import Seo from "@/components/Seo";
import ProjectTrackerManager from "../tracker/ProjectTrackerManager";

export default function ProjectTrackerPage() {
  return (
    <>
      <Seo title="Project Tracker — Enterprise Operations | Zyllo Tech" noindex />
      <div className="w-full">
        <ProjectTrackerManager />
      </div>
    </>
  );
}
