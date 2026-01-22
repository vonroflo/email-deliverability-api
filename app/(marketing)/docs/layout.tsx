import { DocsSidebar } from '@/components/docs';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal-950 flex pt-16">
      <DocsSidebar />
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="px-6 lg:px-8 py-8 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
