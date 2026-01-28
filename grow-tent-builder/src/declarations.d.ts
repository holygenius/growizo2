// Declaration file for JS modules - allows TypeScript to work with JS files

declare module '../services/supabase' {
  export interface SupabaseClientAuth {
    getSession: () => Promise<{ data: { session: unknown } }>;
    signInWithOAuth: (options: {
      provider: string;
      options: {
        redirectTo: string;
        queryParams?: Record<string, string>;
      };
    }) => Promise<{ data: unknown; error: { message: string } | null }>;
    signOut: () => Promise<{ error: unknown }>;
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
      data: { subscription: { unsubscribe: () => void } };
    };
  }

  export interface SupabaseClient {
    auth: SupabaseClientAuth;
  }

  export const supabase: SupabaseClient | null;
  export const isSupabaseConfigured: () => boolean;
  export default supabase;
}

declare module '../services/userService' {
  export const userService: {
    isNewUser: (userId: string) => Promise<boolean>;
    completeOnboarding: (userId: string, data: Record<string, unknown>) => Promise<{ success: boolean }>;
    logAdminAccess: (userId: string, email: string, action: string, metadata: Record<string, unknown>) => Promise<void>;
    checkAdminStatus: (userId: string) => Promise<boolean | null>;
    getUserProfile: (userId: string) => Promise<unknown>;
    updateUserProfile: (userId: string, data: unknown) => Promise<unknown>;
  };
  export default userService;
}

declare module '../services/anScheduleService' {
  export const anScheduleService: {
    getSchedule: () => Promise<unknown[]>;
    getProducts: () => Promise<unknown[]>;
  };
  export default anScheduleService;
}

declare module '../services/blogApi' {
  export const blogApi: {
    getPosts: () => Promise<unknown[]>;
    getPost: (slug: string) => Promise<unknown>;
  };
  export default blogApi;
}

declare module '../services/brandService' {
  export const brandService: {
    getBrands: () => Promise<unknown[]>;
    createBrand: (data: unknown) => Promise<unknown>;
    updateBrand: (id: string, data: unknown) => Promise<unknown>;
    deleteBrand: (id: string) => Promise<void>;
  };
  export default brandService;
}

declare module '../services/ikasService' {
  export const ikasService: {
    syncProducts: () => Promise<unknown>;
    getProducts: () => Promise<unknown[]>;
  };
  export default ikasService;
}

declare module '../services/importService' {
  export const importService: {
    importFromCsv: (file: File) => Promise<unknown>;
    importFromExcel: (file: File) => Promise<unknown>;
  };
  export default importService;
}

declare module '../services/presetService' {
  export const presetService: {
    getPresets: () => Promise<unknown[]>;
    createPreset: (data: unknown) => Promise<unknown>;
    updatePreset: (id: string, data: unknown) => Promise<unknown>;
    deletePreset: (id: string) => Promise<void>;
  };
  export default presetService;
}

declare module '../services/productService' {
  export const productService: {
    getProducts: (filters?: unknown) => Promise<unknown[]>;
    getProduct: (id: string) => Promise<unknown>;
    createProduct: (data: unknown) => Promise<unknown>;
    updateProduct: (id: string, data: unknown) => Promise<unknown>;
    deleteProduct: (id: string) => Promise<void>;
  };
  export default productService;
}

declare module '../services/scheduleService' {
  export const scheduleService: {
    getSchedules: () => Promise<unknown[]>;
    createSchedule: (data: unknown) => Promise<unknown>;
    updateSchedule: (id: string, data: unknown) => Promise<unknown>;
    deleteSchedule: (id: string) => Promise<void>;
  };
  export default scheduleService;
}

// Context declaration files
declare module './OnboardingContext' {
  export const OnboardingProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useOnboarding: () => unknown;
}

declare module './AdminContext' {
  export const AdminProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useAdmin: () => unknown;
}
