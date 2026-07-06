// Page title/description now render in the top AppHeader. This keeps the
// per-page action (e.g. "Add transaction") aligned at the top of the content.
export function PageHeader({
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  if (!action) return null;
  return (
    <div className="mb-6 flex justify-end [&>*]:w-full sm:[&>*]:w-auto">
      {action}
    </div>
  );
}
