import { useRouter } from 'next/router';

export default function StatCard({ title, value, icon, color, bgColor, textColor, link }) {
    const router = useRouter();

    return (
        <div
            className={`stat-card hover:shadow-lg transition-all duration-300`}
            onClick={() => link && router.push(link)}
            style={{
                backgroundColor: bgColor,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s ease',
                cursor: link ? 'pointer' : 'default'
            }}
        >
            <div style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                borderRadius: '12px',
                background: color,
                color: 'white'
            }}>
                {icon}
            </div>
            <div className="stat-info">
                <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0'
                }}>{value}</h3>
                <p style={{
                    margin: '0',
                    color: '#6b7280',
                    fontSize: '0.9rem'
                }}>{title}</p>
            </div>
        </div>
    );
}
