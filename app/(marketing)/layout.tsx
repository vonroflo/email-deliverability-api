import { Header, Footer } from '@/components/landing';
import { getUser } from '@/lib/db/queries';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-charcoal-900">
      <Header user={user} />
      {children}
      <Footer />
    </div>
  );
}
