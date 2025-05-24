import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="container-custom text-center">
        <h1 className="font-display text-6xl md:text-8xl font-medium mb-6">404</h1>
        <h2 className="font-display text-3xl md:text-4xl text-secondary-700 mb-8">Page Not Found</h2>
        <p className="text-lg text-secondary-600 mb-10 max-w-2xl mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;