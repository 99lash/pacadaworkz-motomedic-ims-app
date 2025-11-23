import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { menuConfig } from '../utils/menuConfig';
import { hasPermission } from '../utils/permissions';

export const useFilteredMenu = () => {
  const { userRole } = useAuth();

  return useMemo(() => {
    if (!userRole) return [];
    
    return menuConfig.filter(item => 
      hasPermission(userRole, item.permission)
    );
  }, [userRole]);
};
