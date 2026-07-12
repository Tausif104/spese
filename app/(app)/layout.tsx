import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { MobileNav } from "@/components/mobile-nav";
import { PreferencesProvider } from "@/components/preferences-provider";
import { TopLoader } from "@/components/top-loader";
import { getUserPreferences } from "@/lib/data/preferences";
import { getTotalBalance } from "@/lib/data/dashboard";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, balance] = await Promise.all([
    getUserPreferences(),
    getTotalBalance(),
  ]);

  return (
    <PreferencesProvider
      value={{ currency: prefs.currency, dateFormat: prefs.dateFormat }}
    >
      <Suspense fallback={null}>
        <TopLoader />
      </Suspense>
      <div className="min-h-screen bg-background">
        <MobileNav balance={balance} />
        <AppHeader balance={balance} userName={prefs.name} />
        <div className="flex min-w-0">
          <AppSidebar />
          <main className="mx-auto w-full min-w-0 max-w-[1240px] flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </PreferencesProvider>
  );
}
