interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  iconColor?: string;
  valueColor?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  iconColor = 'text-primary',
  valueColor = 'text-state-idle',
}: StatsCardProps) {
  const changeColor = 
    change && change > 0 
      ? 'text-primary' 
      : change && change < 0 
      ? 'text-error' 
      : 'text-state-disabled';
  
  const changeIcon = 
    change && change > 0 
      ? 'fa-arrow-up' 
      : change && change < 0 
      ? 'fa-arrow-down' 
      : '';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-outline p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-state-disabled font-normal mb-2">{title}</p>
          <p className={`text-3xl sm:text-4xl font-bold ${valueColor} mb-2`}>{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${changeColor}`}>
              {changeIcon && <i className={`fas ${changeIcon} text-xs`}></i>}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`${iconColor} text-2xl sm:text-3xl`}>
          <i className={`fas ${icon}`}></i>
        </div>
      </div>
    </div>
  );
}
