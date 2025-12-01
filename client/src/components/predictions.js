// client/src/components/predictions.js

import React from 'react';
import '../App.css';

const Predictions = ({ predictions }) => {
    // Only show if we have predictions
    if (!predictions || predictions.length === 0) return null;

    return (
        // FIX: Changed marginTop: '20px' to margin: '20px auto' 
        // to center the component horizontally while keeping 20px top/bottom margin.
        <div className="expense-form" style={{ margin: '20px auto', border: '1px solid #61dafb' }}>
            <h3 style={{ color: '#61dafb' }}>Spending Trends</h3>
            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px' }}>
                Based on your last 3 entries, here is what you might spend next:
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {predictions.map((pred, index) => (
                    <div key={index} style={{ 
                        padding: '10px', 
                        backgroundColor: '#282c34', 
                        borderRadius: '5px', 
                        border: '1px solid #555',
                        flex: '1 1 100px'
                    }}>
                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{pred.category}</div>
                        <div style={{ fontSize: '1.2rem', color: '#4BC0C0', marginTop: '5px' }}>
                            ${parseFloat(pred.predicted_amount).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Predictions;