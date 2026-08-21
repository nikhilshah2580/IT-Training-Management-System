import { Outlet } from "react-router-dom";

import InstructorSidebar from "../components/instructor/InstructorSidebar";
import InstructorNavbar from "../components/instructor/InstructorNavbar";

const InstructorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <InstructorNavbar />

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
