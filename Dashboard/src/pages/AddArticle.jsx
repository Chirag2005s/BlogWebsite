import { useNavigate } from 'react-router-dom';
import ContentForm from '../components/ContentForm';

const AddArticle = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Create Technical Article</h1>
        <p className="page-description">Publish in-depth articles, guides, and programming tutorials.</p>
      </div>

      <ContentForm
        type="article"
        onSuccess={() => navigate('/content')}
      />
    </div>
  );
};

export default AddArticle;
