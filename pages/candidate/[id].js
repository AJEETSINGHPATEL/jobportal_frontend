import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaPhone, FaMapMarker, FaGraduationCap, FaBriefcase, FaCode } from 'react-icons/fa';

export default function CandidateProfile() {
  const router = useRouter();
  const { id } = router.query;

  // Mock candidate data based on ID
  const getCandidateData = (id) => {
    const candidates = {
      1: {
        id: 1,
        name: "Sarah Johnson",
        title: "Senior Software Engineer",
        location: "San Francisco, CA",
        email: "sarah.johnson@example.com",
        phone: "(555) 123-4567",
        summary: "Senior Software Engineer with 8 years of experience in React and Node.js. Strong leadership skills and passion for mentoring junior developers. Experienced in building scalable applications and leading cross-functional teams.",
        skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes", "GraphQL"],
        experience: [
          {
            company: "TechCorp Inc.",
            position: "Senior Frontend Engineer",
            duration: "2021 - Present",
            description: "Led development of customer-facing applications using React and Node.js. Mentored junior developers and implemented best practices for code quality."
          },
          {
            company: "InnovateLab",
            position: "Software Engineer",
            duration: "2019 - 2021",
            description: "Developed and maintained web applications using modern JavaScript frameworks. Collaborated with design and product teams to deliver high-quality user experiences."
          },
          {
            company: "DigitalStartups",
            position: "Junior Developer",
            duration: "2018 - 2019",
            description: "Built responsive web applications and implemented UI components. Participated in agile development processes and code reviews."
          }
        ],
        education: [
          {
            school: "Stanford University",
            degree: "Master of Science in Computer Science",
            year: "2017"
          },
          {
            school: "UC Berkeley",
            degree: "Bachelor of Science in Software Engineering",
            year: "2016"
          }
        ]
      },
      2: {
        id: 2,
        name: "Michael Chen",
        title: "Full-Stack Developer",
        location: "New York, NY",
        email: "michael.chen@example.com",
        phone: "(555) 987-6543",
        summary: "Full-stack developer specializing in JavaScript technologies. Proven track record of delivering scalable applications and improving team productivity. Passionate about clean code and efficient development processes.",
        skills: ["JavaScript", "Vue.js", "Python", "Docker", "Express", "MongoDB", "Redis"],
        experience: [
          {
            company: "WebSolutions LLC",
            position: "Full-Stack Developer",
            duration: "2020 - Present",
            description: "Developed full-stack applications using Vue.js and Express. Implemented CI/CD pipelines and improved deployment processes."
          },
          {
            company: "AppMakers Co.",
            position: "Frontend Developer",
            duration: "2018 - 2020",
            description: "Created responsive user interfaces and implemented complex UI features. Collaborated with UX designers to enhance user experience."
          }
        ],
        education: [
          {
            school: "MIT",
            degree: "Bachelor of Science in Computer Science",
            year: "2018"
          }
        ]
      },
      3: {
        id: 3,
        name: "Emma Rodriguez",
        title: "Frontend Specialist",
        location: "Austin, TX",
        email: "emma.rodriguez@example.com",
        phone: "(555) 456-7890",
        summary: "Frontend specialist with expertise in modern UI/UX frameworks. Excellent communicator and collaborative team player. Focused on creating intuitive and accessible user interfaces.",
        skills: ["React", "Angular", "CSS", "Redux", "SASS", "Jest", "Webpack"],
        experience: [
          {
            company: "DesignFirst Studios",
            position: "Senior Frontend Developer",
            duration: "2019 - Present",
            description: "Led frontend development for multiple client projects. Implemented design systems and ensured accessibility compliance."
          },
          {
            company: "CreativeTech",
            position: "UI Developer",
            duration: "2017 - 2019",
            description: "Developed user interfaces based on designer specifications. Optimized web applications for maximum speed and scalability."
          }
        ],
        education: [
          {
            school: "Art Institute of Austin",
            degree: "Bachelor of Fine Arts in Digital Media",
            year: "2017"
          }
        ]
      },
      4: {
        id: 4,
        name: "David Kim",
        title: "Backend Engineer",
        location: "Seattle, WA",
        email: "david.kim@example.com",
        phone: "(555) 234-5678",
        summary: "Backend engineer with strong focus on system architecture and performance optimization. Experience with microservices and cloud platforms. Committed to building robust and scalable backend systems.",
        skills: ["Java", "Spring Boot", "MongoDB", "Kubernetes", "AWS", "REST APIs", "MySQL"],
        experience: [
          {
            company: "CloudSystems Inc.",
            position: "Principal Backend Engineer",
            duration: "2020 - Present",
            description: "Designed and implemented microservices architecture. Led migration to cloud infrastructure and improved system reliability."
          },
          {
            company: "EnterpriseSoft",
            position: "Backend Developer",
            duration: "2017 - 2020",
            description: "Developed RESTful APIs and database schemas. Optimized database queries and improved application performance."
          }
        ],
        education: [
          {
            school: "University of Washington",
            degree: "Master of Science in Software Engineering",
            year: "2017"
          },
          {
            school: "Washington State University",
            degree: "Bachelor of Science in Computer Science",
            year: "2015"
          }
        ]
      },
      5: {
        id: 5,
        name: "Priya Sharma",
        title: "DevOps Engineer",
        location: "Denver, CO",
        email: "priya.sharma@example.com",
        phone: "(555) 876-5432",
        summary: "DevOps engineer with CI/CD expertise and security-first mindset. Proven ability to streamline deployment processes. Focused on automation and infrastructure optimization.",
        skills: ["AWS", "Docker", "Jenkins", "Terraform", "Ansible", "Prometheus", "Grafana"],
        experience: [
          {
            company: "CloudFirst Solutions",
            position: "Senior DevOps Engineer",
            duration: "2019 - Present",
            description: "Implemented CI/CD pipelines and automated deployment processes. Managed cloud infrastructure and monitoring systems."
          },
          {
            company: "InfrastructurePro",
            position: "DevOps Specialist",
            duration: "2017 - 2019",
            description: "Managed container orchestration and deployment workflows. Improved system reliability and reduced downtime."
          }
        ],
        education: [
          {
            school: "Colorado State University",
            degree: "Bachelor of Science in Computer Engineering",
            year: "2017"
          }
        ]
      },
      6: {
        id: 6,
        name: "James Wilson",
        title: "Data Scientist",
        location: "Boston, MA",
        email: "james.wilson@example.com",
        phone: "(555) 345-6789",
        summary: "Data scientist with strong analytical skills and business acumen. Experience in machine learning and predictive modeling. Passionate about turning data into actionable insights.",
        skills: ["Python", "TensorFlow", "SQL", "Pandas", "Scikit-learn", "R", "Tableau"],
        experience: [
          {
            company: "DataInsights Corp",
            position: "Lead Data Scientist",
            duration: "2020 - Present",
            description: "Developed machine learning models for predictive analytics. Led data science projects and presented findings to stakeholders."
          },
          {
            company: "AnalyticsPro",
            position: "Data Analyst",
            duration: "2018 - 2020",
            description: "Performed statistical analysis and data visualization. Built dashboards and reports for business intelligence."
          }
        ],
        education: [
          {
            school: "Harvard University",
            degree: "PhD in Statistics",
            year: "2018"
          },
          {
            school: "MIT",
            degree: "Master of Science in Applied Mathematics",
            year: "2015"
          }
        ]
      }
    };
    
    return candidates[id] || {
      id: 1,
      name: "Default Candidate",
      title: "Software Engineer",
      location: "Remote",
      email: "default@example.com",
      phone: "(555) 000-0000",
      summary: "Default candidate profile for demonstration purposes. This would normally contain detailed information about the candidate's background, skills, and experience.",
      skills: ["JavaScript", "React", "Node.js"],
      experience: [],
      education: []
    };
  };

  const candidate = getCandidateData(id);

  return (
    <div className="candidate-profile">
      <Head>
        <title>{candidate.name} - Candidate Profile | CareerHub</title>
        <meta name="description" content={`${candidate.name} - ${candidate.title} candidate profile`} />
      </Head>

      <div className="profile-header">
        <div className="container">
          <Link href="/employer/smart-matching" className="back-link">
            <FaArrowLeft /> Back to Matches
          </Link>
          
          <div className="profile-overview">
            <div className="profile-info">
              <h1>{candidate.name}</h1>
              <h2>{candidate.title}</h2>
              <div className="location">
                <FaMapMarker /> {candidate.location}
              </div>
              
              <div className="contact-info">
                <div className="contact-item">
                  <FaEnvelope /> {candidate.email}
                </div>
                <div className="contact-item">
                  <FaPhone /> {candidate.phone}
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="action-btn primary">Schedule Interview</button>
              <button className="action-btn secondary">Send Message</button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="container">
          <div className="profile-grid">
            <div className="main-content">
              <section className="summary-section">
                <h3>About</h3>
                <p>{candidate.summary}</p>
              </section>

              <section className="experience-section">
                <h3><FaBriefcase /> Experience</h3>
                <div className="experience-list">
                  {candidate.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <h4>{exp.position}</h4>
                        <div className="experience-company">{exp.company}</div>
                      </div>
                      <div className="experience-duration">{exp.duration}</div>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="sidebar">
              <section className="skills-section">
                <h3><FaCode /> Skills</h3>
                <div className="skills-grid">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </section>

              <section className="education-section">
                <h3><FaGraduationCap /> Education</h3>
                <div className="education-list">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-degree">{edu.degree}</div>
                      <div className="education-school">{edu.school}</div>
                      <div className="education-year">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="actions-sidebar">
                <button className="action-btn full primary">Download Resume</button>
                <button className="action-btn full secondary">Add to Favorites</button>
                <button className="action-btn full outline">Share Profile</button>
              </section>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .candidate-profile {
          min-height: 100vh;
          background: #f8fafc;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          margin: 2rem 0 1rem;
        }

        .back-link:hover {
          color: #1d4ed8;
        }

        .profile-header {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem 0;
        }

        .profile-overview {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 3rem;
        }

        .profile-info h1 {
          font-size: 2.5rem;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .profile-info h2 {
          font-size: 1.5rem;
          color: #64748b;
          margin: 0 0 1rem 0;
          font-weight: 400;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
        }

        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-self: flex-start;
        }

        .action-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 1rem;
        }

        .action-btn.primary {
          background: #2563eb;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1d4ed8;
        }

        .action-btn.secondary {
          background: #f1f5f9;
          color: #2563eb;
          border: 1px solid #cbd5e1;
        }

        .action-btn.secondary:hover {
          background: #e2e8f0;
        }

        .action-btn.outline {
          background: transparent;
          color: #2563eb;
          border: 1px solid #2563eb;
        }

        .action-btn.outline:hover {
          background: #eff6ff;
        }

        .action-btn.full {
          width: 100%;
        }

        .profile-content {
          padding: 3rem 0;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        section h3 {
          color: #1e293b;
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .summary-section p {
          color: #475569;
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .experience-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .experience-item {
          border-left: 3px solid #dbeafe;
          padding-left: 1.5rem;
        }

        .experience-header h4 {
          color: #1e293b;
          margin: 0 0 0.25rem 0;
          font-size: 1.2rem;
        }

        .experience-company {
          color: #64748b;
          font-weight: 500;
        }

        .experience-duration {
          color: #94a3b8;
          font-size: 0.9rem;
          margin: 0.5rem 0;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .skill-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .education-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .education-item {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 1rem;
        }

        .education-item:last-child {
          border-bottom: none;
        }

        .education-degree {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .education-school {
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .education-year {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .actions-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .profile-overview {
            flex-direction: column;
            gap: 2rem;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .profile-info h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}