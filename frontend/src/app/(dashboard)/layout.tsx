import { MainLayout } from "@/components/layout/MainLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <ErrorBoundary>{children}</ErrorBoundary>
    </MainLayout>
  );
}
