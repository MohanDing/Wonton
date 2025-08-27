import { useState } from 'react';

// 球队队徽映射 - 使用免费的队徽API或本地图片
const TEAM_LOGOS = {
  // 英超
  'Manchester City': 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png',
  'Arsenal': 'https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png',
  'Liverpool': 'https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png',
  'Chelsea': 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png',
  'Manchester United': 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png',
  'Tottenham': 'https://logos-world.net/wp-content/uploads/2020/06/Tottenham-Logo.png',
  'Newcastle': 'https://logos-world.net/wp-content/uploads/2020/06/Newcastle-United-Logo.png',
  
  // 西甲
  'Real Madrid': 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
  'Barcelona': 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png',
  'Atletico Madrid': 'https://logos-world.net/wp-content/uploads/2020/06/Atletico-Madrid-Logo.png',
  'Sevilla': 'https://logos-world.net/wp-content/uploads/2020/06/Sevilla-Logo.png',
  
  // 德甲
  'Bayern Munich': 'https://logos-world.net/wp-content/uploads/2020/06/Bayern-Munich-Logo.png',
  'Borussia Dortmund': 'https://logos-world.net/wp-content/uploads/2020/06/Borussia-Dortmund-Logo.png',
  'RB Leipzig': 'https://logos-world.net/wp-content/uploads/2020/06/RB-Leipzig-Logo.png',
  
  // 意甲
  'Juventus': 'https://logos-world.net/wp-content/uploads/2020/06/Juventus-Logo.png',
  'AC Milan': 'https://logos-world.net/wp-content/uploads/2020/06/AC-Milan-Logo.png',
  'Inter Milan': 'https://logos-world.net/wp-content/uploads/2020/06/Inter-Milan-Logo.png',
  'Napoli': 'https://logos-world.net/wp-content/uploads/2020/06/Napoli-Logo.png',
  
  // 法甲
  'PSG': 'https://logos-world.net/wp-content/uploads/2020/06/Paris-Saint-Germain-Logo.png',
  'Marseille': 'https://logos-world.net/wp-content/uploads/2020/06/Marseille-Logo.png',
  'Lyon': 'https://logos-world.net/wp-content/uploads/2020/06/Lyon-Logo.png'
};

// 获取队徽的备用方案
const getTeamLogoUrl = (teamName) => {
  // 首先尝试从映射中获取
  if (TEAM_LOGOS[teamName]) {
    return TEAM_LOGOS[teamName];
  }
  
  // 备用方案：使用队名首字母
  const initials = teamName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return null; // 返回null，让组件显示首字母
};

export default function TeamLogo({ 
  teamName, 
  size = 'default', 
  className = '' 
}) {
  const [imageError, setImageError] = useState(false);
  const logoUrl = getTeamLogoUrl(teamName);
  
  const sizeClasses = {
    tiny: 'w-7 h-7 text-[11px]',
    small: 'w-6 h-6 text-xs',
    default: 'w-8 h-8 text-sm',
    large: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // 如果没有队徽URL或图片加载失败，显示首字母
  if (!logoUrl || imageError) {
    const initials = teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div 
        className={`
          ${sizeClasses[size]} 
          bg-[var(--dark-bg-tertiary)] 
          border border-[var(--dark-border-light)] 
          rounded-full 
          flex items-center justify-center 
          font-semibold 
          text-[var(--dark-text-primary)]
          ${className}
        `}
        title={teamName}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${teamName} logo`}
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        object-cover 
        border border-[var(--dark-border-light)]
        ${className}
      `}
      onError={handleImageError}
      title={teamName}
    />
  );
}
