

export default function Services() {
  const services = [
    {
      id: 1,
      title: 'Resume Display',
      description: 'Increase your Profile Visibility to recruiters upto 3 times.',
      benefits: [
        'Get a Featured Profile',
        'Stand out and get noticed in recruiter eyes',
        'Rank higher in Recruiter Searches'
      ],
      price: '₹1949',
      period: 'for 3 Months',
      popular: true
    },
    {
      id: 2,
      title: 'Priority Applicant',
      description: 'Be a Priority Applicant & increase your chance of getting a call.',
      benefits: [
        'Be the first one to apply',
        'Catch recruiter attention',
        'Priority Access to Jobs'
      ],
      price: '₹881',
      period: 'for 3 Months',
      popular: true
    },
    {
      id: 3,
      title: 'Job Search Booster',
      description: 'Boost your job search with referrals',
      benefits: [
        'Take help from over 20,000 seniors',
        'In top companies like TCS, HCL, Accenture etc.',
        'Get referrals for better opportunities'
      ],
      price: '₹839',
      period: 'for 3 Months',
      popular: false
    },
    {
      id: 4,
      title: 'Monthly Job Search Plan',
      description: 'Subscribe to our Monthly Job Search Plan',
      benefits: [
        'Rank higher in Recruiter Searches',
        'Priority Access to Jobs',
        'Send message to Recruiter anytime'
      ],
      price: '₹839',
      period: 'for 3 Months',
      popular: false
    }
  ];

  return (
    <div className="container">
      <main className="main">
        <div className="services-header">
          <h1>Move ahead in career, faster</h1>
          <p>with our paid services</p>
        </div>
        
        <div className="services-container">
          {services.map(service => (
            <div key={service.id} className={`service-card ${service.popular ? 'popular' : ''}`}>
              {service.popular && <div className="popular-badge">MOST POPULAR</div>}
              <h2>{service.title}</h2>
              <p className="service-description">{service.description}</p>
              <ul className="benefits-list">
                {service.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <div className="price-section">
                <p className="price">Subscription starts from</p>
                <p className="amount">{service.price} {service.period}</p>
              </div>
              <button className="btn-know-more">Know More</button>
              <button className="btn-buy-now">Buy Now</button>
            </div>
          ))}
        </div>
        
        <div className="contact-section">
          <h2>Talk to Us</h2>
          <p>Call us Toll Free: 1800-102-5557</p>
          <p>(9.00AM to 9.00PM IST)</p>
          <p>International Customer Call: +91-120-1421100</p>
          <p>for bulk queries call: 18001034477</p>
        </div>
        
        <div className="contact-form">
          <h2>Contact Us</h2>
          <p>Our executive will get in touch with you soon</p>
          <form className="contact-form-fields">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email ID</label>
                <input type="email" id="email" className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobile">Mobile</label>
                <input type="tel" id="mobile" className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="query">Write your query here</label>
                <textarea id="query" rows="4" className="form-input"></textarea>
              </div>
            </div>
            <button type="submit" className="btn-submit">Submit</button>
          </form>
        </div>
      </main>
      
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        .main {
          flex: 1;
          padding: 2rem 5%;
          background: #f5f5f5;
          min-height: calc(100vh - 200px);
        }
        
        .services-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .services-header h1 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .services-container {
          max-width: 1200px;
          margin: 0 auto 3rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .service-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .service-card.popular {
          border: 2px solid #0070f3;
          box-shadow: 0 4px 12px rgba(0,112,243,0.15);
        }
        
        .popular-badge {
          position: absolute;
          top: -12px;
          right: 1rem;
          background: #ff9900;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .service-card h2 {
          margin-top: 0;
          color: #333;
        }
        
        .service-description {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }
        
        .benefits-list li {
          margin-bottom: 0.5rem;
          position: relative;
          padding-left: 1.5rem;
        }
        
        .benefits-list li:before {
          content: "✓";
          color: #4caf50;
          position: absolute;
          left: 0;
          top: 0;
        }
        
        .price-section {
          margin-bottom: 1.5rem;
        }
        
        .price {
          margin: 0;
          color: #666;
        }
        
        .amount {
          margin: 0.25rem 0 0;
          font-size: 1.25rem;
          font-weight: bold;
          color: #0070f3;
        }
        
        .btn-know-more {
          width: 100%;
          padding: 0.75rem;
          background: white;
          color: #0070f3;
          border: 1px solid #0070f3;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 0.75rem;
        }
        
        .btn-buy-now {
          width: 100%;
          padding: 0.75rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .contact-section {
          max-width: 800px;
          margin: 3rem auto;
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .contact-section h2 {
          margin-top: 0;
          color: #333;
        }
        
        .contact-form {
          max-width: 600px;
          margin: 3rem auto;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .contact-form h2 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }
        
        .contact-form-fields {
          margin-top: 1.5rem;
        }
        
        .form-row {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .btn-submit {
          width: 100%;
          padding: 0.75rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .services-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}