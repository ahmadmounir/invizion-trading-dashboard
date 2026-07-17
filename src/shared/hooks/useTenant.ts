import { useProfile } from '@/shared/stores/profileStore';

const EMPTY_TENANT_ID = null;

/**
 * Hook to check if user is currently in a tenant
 * @returns boolean - true if user has a tenant, false otherwise
 */
export const useTenant = () => {
  const profile = useProfile();
  const hasTenant = !!profile?.tenantId && profile.tenantId !== EMPTY_TENANT_ID;
  return hasTenant;
};

export const useIsDefaultTenant = () => {
  const profile = useProfile();
  return profile?.isDefaultTenant || false;
}

/**
 * Hook to get tenant information
 * @returns object with tenant ID and name, or null if no tenant
 */
export const useTenantInfo = () => {
  const profile = useProfile();
  
  if (!profile?.tenantId || profile.tenantId === EMPTY_TENANT_ID) {
    return null;
  }

  return {
    tenantId: profile.tenantId,
    tenantName: profile.tenantName,
  };
};
