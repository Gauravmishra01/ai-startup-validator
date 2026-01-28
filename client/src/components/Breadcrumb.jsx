import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            to="/"
            className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
