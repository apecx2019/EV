import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const ForecastPlot = ({ forecastData }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">
        {t('dashboard.chart_forecast_title')}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {t('dashboard.chart_forecast_desc')}
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={forecastData}>
          <Line type="monotone" dataKey="sales_actual" stroke="#4F46E5" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sales_forecast" stroke="#F97316" strokeWidth={2} dot={false} />

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastPlot;
