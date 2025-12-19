import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const CustomRadarChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxScore = Math.max(...data.map(item => item.score), 100);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis 
          dataKey="trait" 
          tick={{ fill: '#94a3b8', fontSize: 12 }} 
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, maxScore]} 
          tick={false} 
          axisLine={false} 
        />
        <Radar
          name="Personality"
          dataKey="score"
          stroke="#38bdf8"
          strokeWidth={3}
          fill="#818cf8"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default CustomRadarChart;