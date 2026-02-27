import React from 'react';
import { useRouter } from 'next/router';

const StatCard = ({ id, title, value, icon, color, bgColor, textColor, link }) => {
    const router = useRouter();

    return (
        <div
            className="stat-card"
            onClick={() => link && router.push(link)}
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: link ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                border: '1px solid #f3f4f6'
            }}
            onMouseEnter={(e) => {
                if (link) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }
            }}
            onMouseLeave={(e) => {
                if (link) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }
            }}
        >
            <div
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: bgColor || '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: textColor || '#1f2937',
                    fontSize: '1.5rem',
                    flexShrink: 0
                }}
            >
                {icon}
            </div>
            <div>
                <h3
                    style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        fontWeight: '500',
                        margin: 0,
                        marginBottom: '0.25rem'
                    }}
                >
                    {title}
                </h3>
                <div
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        background: color && color.includes('gradient') ? color : 'none',
                        WebkitBackgroundClip: color && color.includes('gradient') ? 'text' : 'none',
                        WebkitTextFillColor: color && color.includes('gradient') ? 'transparent' : 'inherit'
                    }}
                >
                    {value}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
