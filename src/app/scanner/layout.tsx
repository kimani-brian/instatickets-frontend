// Scanner has its own layout — no Navbar or Footer
// It is a purpose-built, full-screen tool for venue staff
export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}