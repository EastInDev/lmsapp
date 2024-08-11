"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function withAuth(
  WrappedComponent: React.ComponentType,
  allowedRoles: string[]
) {
  return function AuthenticatedComponent(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      async function checkAuth() {
        try {
          const response = await fetch("/api/auth/check");
          if (response.ok) {
            const data = await response.json();
            if (allowedRoles.includes(data.user.role)) {
              setIsAuthenticated(true);
            } else {
              router.push("/");
            }
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          router.push("/");
        } finally {
          setIsLoading(false);
        }
      }

      checkAuth();
    }, []);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
