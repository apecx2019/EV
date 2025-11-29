import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const DriverImpactChart = ({ impactData }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">
        {t('dashboard.analysis_driver_title')}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {t('dashboard.analysis_driver_desc')}
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={impactData} layout="vertical" margin={{ left: 20, right: 30 }}>
          <XAxis type="number" />
          <YAxis dataKey="feature" type="category" width={150} />
          <Tooltip />
          <Bar dataKey="importance_score" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DriverImpactChart;
