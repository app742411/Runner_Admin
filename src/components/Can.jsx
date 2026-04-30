import { usePermission } from '@/hooks/usePermission';

export const Can = ({ permission, children }) => {
  const { can } = usePermission();
  return can(permission) ? children : null;
};
