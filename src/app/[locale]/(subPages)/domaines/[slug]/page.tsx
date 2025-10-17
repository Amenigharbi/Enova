import DomainRobotsPage from '@/features/domains/components/DomainRobotsPage/DomainRobotsPage';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <DomainRobotsPage slug={params.slug} locale={params.locale} />;
}