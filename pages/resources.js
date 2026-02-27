import Navigation from '../components/Navigation';

export default function Resources() {
  const resources = [
    {
      id: 1,
      title: 'Resume Writing Tips',
      description: 'Learn how to create a standout resume that gets noticed by employers.',
      category: 'Resume',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Interview Preparation Guide',
      description: 'Essential tips and strategies to ace your next job interview.',
      category: 'Interview',
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'Job Search Strategies',
      description: 'Effective techniques to find and apply for the right job opportunities.',
      category: 'Job Search',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Salary Negotiation',
      description: 'How to negotiate your salary and benefits package effectively.',
      category: 'Career',
      readTime: '7 min read'
    },
    {
      id: 5,
      title: 'Networking Tips',
      description: 'Build professional relationships that can advance your career.',
      category: 'Networking',
      readTime: '4 min read'
    },
    {
      id: 6,
      title: 'Workplace Communication',
      description: 'Improve your communication skills for better workplace relationships.',
      category: 'Soft Skills',
      readTime: '5 min read'
    }
  ];

  const categories = [
    { name: 'All', count: 12 },
    { name: 'Resume', count: 3 },
    { name: 'Interview', count: 4 },
    { name: 'Job Search', count: 2 },
    { name: 'Career', count: 2 },
    { name: 'Networking', count: 1 }
  ];

  return (
    <div className="container">
      <main className="main">
        <div className="resources-header">
          <h1>Career Resources</h1>
          <p>Helpful guides and tips to advance your career</p>
        </div>
        
        <div className="resources-container">
          <div className="categories-sidebar">
            <h3>Categories</h3>
            <ul className="category-list">
              {categories.map((category, index) => (
                <li key={index} className="category-item">
                  <a href="#" className={index === 0 ? 'active' : ''}>
                    {category.name} <span>({category.count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="resources-content">
            <div className="resources-grid">
              {resources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-category">
                    {resource.category}
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-meta">
                    <span>{resource.readTime}</span>
                    <button className="read-button">Read More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
        }
        
        .main {
          flex: 1;
          padding: 2rem 5%;
          background: #f5f5f5;
          min-height: calc(100vh - 200px);
        }
        
        .resources-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .resources-header h1 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .resources-header p {
          color: #666;
          font-size: 1.1rem;
        }
        
        .resources-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          gap: 2rem;
          padding: 0 5%;
        }
        
        .categories-sidebar {
          flex: 0 0 250px;
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .categories-sidebar h3 {
          margin-top: 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .category-list {
          list-style: none;
          padding: 0;
        }
        
        .category-item {
          margin-bottom: 0.75rem;
        }
        
        .category-item a {
          text-decoration: none;
          color: #333;
          display: flex;
          justify-content: space-between;
        }
        
        .category-item a.active {
          color: #0070f3;
          font-weight: 500;
        }
        
        .resources-content {
          flex: 1;
        }
        
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .resource-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .resource-category {
          display: inline-block;
          background: #e3f2fd;
          color: #0070f3;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }
        
        .resource-card h3 {
          margin-top: 0;
          margin-bottom: 0.75rem;
          color: #333;
        }
        
        .resource-card p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .resource-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .resource-meta span {
          color: #999;
          font-size: 0.9rem;
        }
        
        .read-button {
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .resources-container {
            flex-direction: column;
          }
          
          .categories-sidebar {
            flex: 0 0 auto;
          }
          
          .resources-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
