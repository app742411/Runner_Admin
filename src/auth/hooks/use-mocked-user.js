import { useSelector } from 'react-redux';
import { useGetRole } from 'src/features/auth/useGetRole';

// ----------------------------------------------------------------------

export function useMockedUser() {
  const { user } = useSelector((state) => state.auth);
  
  // Fetch real user data from /api/auth/getRole
  useGetRole();

  const mockUser = {
    ...user,
    displayName: user ? `${user.firstName} ${user.lastName}` : '',
    photoURL: user?.photoURL || '',
  };

  return { user: mockUser };
}
