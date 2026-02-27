import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { COLLECTIONS } from './firebaseCollections';

// Initialize Firebase with sample data
export const initializeFirebaseData = async () => {
  try {
    console.log('Initializing Firebase database with sample data...');
    
    // Create sample jobs
    const sampleJobs = [
      {
        title: 'Senior Python Developer',
        company: 'Tech Innovations Inc.',
        companyId: 'tech-innovations-1',
        location: 'Bangalore, India (Remote)',
        salary: '$800,000 - $1,200,000',
        skills: ['Python', 'Django', 'FastAPI', 'AWS', 'Docker', 'PostgreSQL'],
        experience: '3-5 years',
        description: 'We are looking for an experienced Python developer to join our dynamic team. You will be responsible for building scalable web applications and APIs using modern Python frameworks.',
        workMode: 'Remote',
        jobType: 'Full-time',
        isActive: true
      },
      {
        title: 'Frontend React Developer',
        company: 'Digital Solutions Ltd.',
        companyId: 'digital-solutions-1',
        location: 'Mumbai, India (Hybrid)',
        salary: '$600,000 - $900,000',
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux', 'TypeScript'],
        experience: '2-4 years',
        description: 'Join our frontend team to build amazing user experiences with modern React technologies.',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        isActive: true
      },
      {
        title: 'Data Scientist',
        company: 'Analytics Pro',
        companyId: 'analytics-pro-1',
        location: 'Hyderabad, India (Remote)',
        salary: '$1,000,000 - $1,500,000',
        skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'Pandas'],
        experience: '4-7 years',
        description: 'Looking for a data scientist to drive our analytics initiatives and build predictive models.',
        workMode: 'Remote',
        jobType: 'Full-time',
        isActive: true
      },
      {
        title: 'DevOps Engineer',
        company: 'Cloud Systems Inc.',
        companyId: 'cloud-systems-1',
        location: 'Pune, India (Remote)',
        salary: '$900,000 - $1,300,000',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
        experience: '3-5 years',
        description: 'Help us build and maintain our cloud infrastructure with modern DevOps practices.',
        workMode: 'Remote',
        jobType: 'Full-time',
        isActive: true
      }
    ];

    // Create sample employer contacts
    const sampleContacts = [
      {
        companyId: 'tech-innovations-1',
        companyName: 'Tech Innovations Inc.',
        hrName: 'Sarah Johnson',
        phone: '+91-98765-43210',
        email: 'careers@techinnovations.com',
        website: 'www.techinnovations.com',
        linkedin: 'linkedin.com/company/tech-innovations'
      },
      {
        companyId: 'digital-solutions-1',
        companyName: 'Digital Solutions Ltd.',
        hrName: 'Michael Chen',
        phone: '+91-98765-43211',
        email: 'jobs@digitalsolutions.com',
        website: 'www.digitalsolutions.com',
        linkedin: 'linkedin.com/company/digital-solutions'
      },
      {
        companyId: 'analytics-pro-1',
        companyName: 'Analytics Pro',
        hrName: 'Priya Sharma',
        phone: '+91-98765-43212',
        email: 'hiring@analyticspro.com',
        website: 'www.analyticspro.com',
        linkedin: 'linkedin.com/company/analytics-pro'
      },
      {
        companyId: 'cloud-systems-1',
        companyName: 'Cloud Systems Inc.',
        hrName: 'David Wilson',
        phone: '+91-98765-43213',
        email: 'recruitment@cloudsystems.com',
        website: 'www.cloudsystems.com',
        linkedin: 'linkedin.com/company/cloud-systems'
      }
    ];

    // Add sample jobs to Firebase
    console.log('Adding sample jobs...');
    for (const job of sampleJobs) {
      try {
        const jobsRef = collection(db, COLLECTIONS.JOBS);
        await addDoc(jobsRef, {
          ...job,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`✓ Added job: ${job.title}`);
      } catch (error) {
        console.error(`✗ Error adding job ${job.title}:`, error);
      }
    }

    // Add sample employer contacts to Firebase
    console.log('Adding employer contacts...');
    for (const contact of sampleContacts) {
      try {
        const contactsRef = collection(db, COLLECTIONS.EMPLOYER_CONTACTS);
        await addDoc(contactsRef, {
          ...contact,
          createdAt: serverTimestamp()
        });
        console.log(`✓ Added contact: ${contact.companyName}`);
      } catch (error) {
        console.error(`✗ Error adding contact ${contact.companyName}:`, error);
      }
    }

    console.log('✅ Firebase database initialization completed!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing Firebase database:', error);
    return false;
  }
};

// Function to clear existing data (useful for testing)
export const clearFirebaseData = async () => {
  try {
    console.log('Clearing Firebase database...');
    // Note: In a real application, you would need to implement proper data deletion
    // This is just a placeholder for demonstration
    console.log('⚠️ Data clearing functionality would be implemented here');
    return true;
  } catch (error) {
    console.error('Error clearing Firebase data:', error);
    return false;
  }
};

// Run initialization if called directly
if (typeof window !== 'undefined' && window.location.pathname === '/init-firebase') {
  // This would be called from a special admin page
  initializeFirebaseData();
}