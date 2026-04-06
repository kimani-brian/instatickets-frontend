export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Auth pages sit below the navbar but fill the remaining height
    <div className="min-h-[calc(100vh-4rem)]">
      {children}
    </div>
  );
}