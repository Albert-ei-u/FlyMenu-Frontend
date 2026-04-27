import { PlatformFooter } from "@/components/platform/PlatformFooter";
import { PlatformSettingsView } from "@/components/platform/PlatformSettingsView";
import { SuperAdminShell } from "@/components/platform/SuperAdminShell";

export default function PlatformSettingsPage() {
  return (
    <SuperAdminShell
      active="Settings"
      topTab="System Status"
      searchPlaceholder="Search settings, users, or system logs..."
    >
      <div className="px-6 py-6 max-lg:px-4">
        <PlatformSettingsView />
        <PlatformFooter />
      </div>
    </SuperAdminShell>
  );
}
