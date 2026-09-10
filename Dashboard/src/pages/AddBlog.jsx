import { useNavigate } from 'react-router-dom';
import ContentForm from '../components/ContentForm';

const AddBlog = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Create Blog Post</h1>
        <p className="page-description">Write, format, and publish a new tech blog to TechJourney.</p>
      </div>

      <ContentForm
        type="blog"
        onSuccess={() => navigate('/content')}
      />
    </div>
  );
};

export default AddBlog;
