import RobotFormPage from '@/features/robots/Components/RobotFormPage/RobotFormPage';

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default function EditRobotPage({ params }: PageProps) {
  return (
    <RobotFormPage 
      locale={params.locale}
      robotId={params.id}
      isEdit={true}
    />
  );
}