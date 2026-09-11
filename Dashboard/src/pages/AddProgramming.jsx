import { useNavigate } from 'react-router-dom';
import ContentForm from '../components/ContentForm';

const AddProgramming = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Create Programming Post</h1>
        <p className="page-description">Share programming tutorials, code snippets, and dev insights with the community.</p>
      </div>

      <ContentForm
        type="programming"
        onSuccess={() => navigate('/content')}
      />
    </div>
  );
};

export default AddProgramming;
