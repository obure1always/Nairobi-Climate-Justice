import { Navigate, useSearchParams } from 'react-router-dom';
import { CourseUsabilitySurvey } from './CourseUsability';

export default function AssessmentView() {
  const [searchParams] = useSearchParams();
  if (searchParams.get('type') === 'sus') return <CourseUsabilitySurvey />;
  // Keep old bookmarks working without submitting incompatible legacy questions.
  return <Navigate to="/learning-survey" replace />;
}
