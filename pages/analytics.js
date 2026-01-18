import { useState, useEffect } from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaUsers, FaEye, FaStar } from 'react-icons/fa';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days');
  
  // Mock analytics data
  const jobPostingsData = [
    { date: '2023-05-01', count: 12 },
    { date: '2023-05-08', count: 18 },
    { date: '2023-05-15', count: 15 },
    { date: '2023-05-22', count: 22 },
    { date: '2023-05-29', count: 19 },
    { date: '2023-06-05', count: 25 },
    { date: '2023-06-12', count: 28 }
  ];
  
  const applicationSources = [
    { source: 'Direct', count: 124 },
    { source: 'Job Boards', count: 87 },
    { source: 'Social Media', count: 42 },
    { source: 'Referrals', count: 31 }
  ];
  
  const jobPerformance = [
    { title: 'Senior Developer', views: 245, applications: 32, shortlisted: 8 },
    { title: 'UX Designer', views: 187, applications: 28, shortlisted: 6 },
    { title: 'Marketing Manager', views: 156, applications: 21, shortlisted: 5 },
    { title: 'Data Scientist', views: 134, applications: 18, shortlisted: 4 }
  ];

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>Analytics Dashboard</h1>
          <p>Track and analyze your recruitment performance</p>
          
          <div className="time-filters">
            <button 
              className={`time-btn ${timeRange === '7days' ? 'active' : ''}`} 
              onClick={() => setTimeRange('7days')}
            >
              7 Days
            </button>
            <button 
              className={`time-btn ${timeRange === '30days' ? 'active' : ''}`} 
              onClick={() => setTimeRange('30days')}
            >
              30 Days
            </button>
            <button 
              className={`time-btn ${timeRange === '90days' ? 'active' : ''}`} 
              onClick={() => setTimeRange('90days')}
            >
              90 Days
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-icon bg-blue">
            <FaUsers />
          </div>
          <div className="metric-info">
            <h3>1,247</h3>
            <p>Total Applications</p>
          </div>
          <div className="metric-trend positive">
            +12.5%
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon bg-green">
            <FaEye />
          </div>
          <div className="metric-info">
            <h3>8,429</h3>
            <p>Job Views</p>
          </div>
          <div className="metric-trend positive">
            +8.3%
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon bg-orange">
            <FaStar />
          </div>
          <div className="metric-info">
            <h3>142</h3>
            <p>Shortlisted</p>
          </div>
          <div className="metric-trend negative">
            -2.1%
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon bg-purple">
            <FaChartBar />
          </div>
          <div className="metric-info">
            <h3>24.7%</h3>
            <p>Conversion Rate</p>
          </div>
          <div className="metric-trend positive">
            +3.2%
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Job Postings Over Time</h2>
            <div className="chart-actions">
              <button className="chart-btn active">Weekly</button>
              <button className="chart-btn">Monthly</button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {jobPostingsData.map((data, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{ height: `${(data.count / 30) * 100}%` }}
                  ></div>
                  <div className="chart-label">{data.date.split('-')[2]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h2>Application Sources</h2>
          </div>
          <div className="chart-placeholder">
            <div className="pie-chart">
              <div className="pie-slice slice-1"></div>
              <div className="pie-slice slice-2"></div>
              <div className="pie-slice slice-3"></div>
              <div className="pie-slice slice-4"></div>
              <div className="pie-center">Sources</div>
            </div>
            <div className="pie-legend">
              {applicationSources.map((source, index) => (
                <div key={index} className="legend-item">
                  <div className={`legend-color color-${index + 1}`}></div>
                  <span>{source.source}: {source.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Performance Table */}
      <div className="performance-container">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Job Performance</h2>
          </div>
          <div className="performance-table">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Views</th>
                  <th>Applications</th>
                  <th>Shortlisted</th>
                  <th>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {jobPerformance.map((job, index) => (
                  <tr key={index}>
                    <td>{job.title}</td>
                    <td>{job.views}</td>
                    <td>{job.applications}</td>
                    <td>{job.shortlisted}</td>
                    <td>{((job.shortlisted / job.applications) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-container {
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }

        .analytics-header {
          background: linear-gradient(135deg, #0070f3 0%, #0055cc 100%);
          color: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 10px 0;
        }

        .header-content p {
          font-size: 1.1rem;
          margin: 0 0 20px 0;
          opacity: 0.9;
        }

        .time-filters {
          display: flex;
          gap: 10px;
        }

        .time-btn {
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .time-btn:hover, .time-btn.active {
          background: rgba(255, 255, 255, 0.2);
          border-color: white;
        }

        /* Metrics Section */
        .metrics-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto 2rem;
        }

        .metric-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 20px;
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }

        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          margin-right: 20px;
        }

        .bg-blue { background: #0070f3; }
        .bg-green { background: #28a745; }
        .bg-orange { background: #ffc107; }
        .bg-purple { background: #6f42c1; }

        .metric-info h3 {
          margin: 0 0 5px 0;
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
        }

        .metric-info p {
          margin: 0;
          color: #666;
          font-size: 1rem;
        }

        .metric-trend {
          margin-left: auto;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .positive {
          background: #d4edda;
          color: #155724;
        }

        .negative {
          background: #f8d7da;
          color: #721c24;
        }

        /* Charts Section */
        .charts-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto 2rem;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 20px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-header h2 {
          margin: 0;
          font-size: 1.3rem;
          color: #333;
        }

        .chart-actions {
          display: flex;
          gap: 10px;
        }

        .chart-btn {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .chart-btn.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }

        .chart-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 8px;
        }

        /* Bar Chart */
        .chart-bars {
          display: flex;
          align-items: end;
          height: 200px;
          gap: 20px;
          padding: 20px;
        }

        .chart-bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .chart-bar {
          width: 40px;
          background: #0070f3;
          border-radius: 4px 4px 0 0;
          min-height: 10px;
        }

        .chart-label {
          margin-top: 10px;
          font-size: 0.8rem;
          color: #666;
        }

        /* Pie Chart */
        .pie-chart {
          position: relative;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: conic-gradient(
            #0070f3 0% 40%,
            #28a745 40% 65%,
            #ffc107 65% 85%,
            #6f42c1 85% 100%
          );
        }

        .pie-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #333;
        }

        .pie-legend {
          margin-left: 30px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          margin-right: 10px;
        }

        .color-1 { background: #0070f3; }
        .color-2 { background: #28a745; }
        .color-3 { background: #ffc107; }
        .color-4 { background: #6f42c1; }

        /* Performance Table */
        .performance-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .performance-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        tr:hover {
          background: #f8f9fa;
        }

        @media (max-width: 992px) {
          .charts-container {
            grid-template-columns: 1fr;
          }
          
          .pie-chart-container {
            flex-direction: column;
            align-items: center;
          }
          
          .pie-legend {
            margin-left: 0;
            margin-top: 20px;
          }
        }

        @media (max-width: 768px) {
          .metrics-container {
            grid-template-columns: 1fr 1fr;
          }
          
          .metric-card {
            padding: 15px;
          }
          
          .metric-icon {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
            margin-right: 15px;
          }
          
          .metric-info h3 {
            font-size: 1.5rem;
          }
          
          .time-filters {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .metrics-container {
            grid-template-columns: 1fr;
          }
          
          .chart-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}