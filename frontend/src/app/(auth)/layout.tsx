export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="w-full max-w-lg rounded-2xl border bg-card/80 backdrop-blur-sm p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
}
