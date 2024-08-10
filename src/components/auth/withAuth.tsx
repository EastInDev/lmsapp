'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

export default function withAuth(WrappedComponent: React.ComponentType, allowedRoles: string[]) {
  return function AuthenticatedComponent(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
      } else {
        const decodedToken = verifyToken(token);
        if (decodedToken && allowedRoles.includes(decodedToken.role)) {
          setIsAuthenticated(true);
        } else {
          router.push('/auth/login');
        }
      }
    }, []);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}