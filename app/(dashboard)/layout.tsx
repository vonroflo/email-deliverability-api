export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout wraps all routes in the (dashboard) group
  // The actual dashboard layout with sidebar is in /dashboard/layout.tsx
  return <>{children}</>;
}
