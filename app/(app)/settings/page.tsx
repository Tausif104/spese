import { Download } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";
import { PreferencesForm } from "@/components/settings/preferences-form";
import { PasswordForm } from "@/components/settings/password-form";
import { DeleteAccount } from "@/components/settings/delete-account";
import { getUserPreferences } from "@/lib/data/preferences";

export default async function SettingsPage() {
  const prefs = await getUserPreferences();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and account."
      />

      <div className="max-w-2xl space-y-6">
        <Section
          title="Profile"
          description="Your display name and account email."
        >
          <ProfileForm name={prefs.name} email={prefs.email} />
        </Section>

        <Section
          title="Preferences"
          description="How amounts and dates are shown across the app."
        >
          <PreferencesForm
            currency={prefs.currency}
            dateFormat={prefs.dateFormat}
          />
        </Section>

        <Section title="Security" description="Change your password.">
          <PasswordForm />
        </Section>

        <Section
          title="Data"
          description="Download a copy of your transactions."
        >
          <a
            href="/api/export/transactions"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Download className="size-4" />
            Export transactions (CSV)
          </a>
        </Section>

        <Card className="border-destructive/40 ring-destructive/20">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              Danger zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteAccount email={prefs.email} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
