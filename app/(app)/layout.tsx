import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { PreferencesProvider } from "@/components/preferences-provider";
import { TopLoader } from "@/components/top-loader";
import { getUserPreferences } from "@/lib/data/preferences";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefs = await getUserPreferences();

  return (
    <PreferencesProvider
      value={{ currency: prefs.currency, dateFormat: prefs.dateFormat }}
    >
      <Suspense fallback={null}>
        <TopLoader />
      </Suspense>
      <div className="flex min-h-screen flex-1">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileNav />
          <main className="mx-auto w-full min-w-0 max-w-[1170px] flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </PreferencesProvider>
  );
}
