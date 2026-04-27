import { LoadingScreen } from "@/components/motion/LoadingScreen";
import { ADMIN_SIDEBAR_WIDTH } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-dvh bg-[#0d0d0d]" style={{ paddingLeft: ADMIN_SIDEBAR_WIDTH }}>
      <LoadingScreen variant="dashboard" />
    </div>
  );
}
