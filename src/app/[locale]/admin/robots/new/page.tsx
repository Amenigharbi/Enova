import RobotFormPage from '@/features/robots/Components/RobotFormPage/RobotFormPage';

interface PageProps {
  params: {
    locale: string;
  };
  searchParams: {
    domain?: string;
  };
}

export default function NewRobotPage({ params, searchParams }: PageProps) {
  return (
    <RobotFormPage 
      locale={params.locale}
      domainId={searchParams.domain}
    />
  );
}