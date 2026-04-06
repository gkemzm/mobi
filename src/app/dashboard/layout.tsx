import DashboardLayout from "@/modules/components/layout/dashboardLayout";

export default function SampleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <div>{children}</div>
    </DashboardLayout>
  );
}
