import RobotDetailsPage from '@/features/robots/Components/RobotDetailsPage/RobotDetailsPage';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <RobotDetailsPage slug={params.slug} locale={params.locale} />;
}