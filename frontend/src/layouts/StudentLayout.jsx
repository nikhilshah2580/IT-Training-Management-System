import { Outlet } from "react-router-dom";

import StudentSidebar from "../components/student/StudentSidebar";
import StudentNavbar from "../components/student/StudentNavbar";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <StudentNavbar />

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
