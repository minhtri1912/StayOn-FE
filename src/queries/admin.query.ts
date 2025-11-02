import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Admin Dashboard
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin_dashboard_stats'],
    queryFn: async () => {
      return BaseRequest.Get('api/admin/dashboard/stats');
    },
    staleTime: 60000 // 1 minute
  });
};

export const useAdminMonthlyRevenue = (year: number) => {
  return useQuery({
    queryKey: ['admin_monthly_revenue', year],
    queryFn: async () => {
      return BaseRequest.Get(
        `api/admin/dashboard/monthly-revenue?year=${year}`
      );
    },
    staleTime: 60000 // 1 minute
  });
};

// Admin Confessions
export const useAdminConfessionsPending = () => {
  return useQuery({
    queryKey: ['admin_confessions_pending'],
    queryFn: async () => {
      return BaseRequest.Get('api/admin/confessions/pending');
    }
  });
};

export const useApproveConfession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      moderatorId
    }: {
      id: string;
      moderatorId: string;
    }) => {
      return BaseRequest.Put(`api/admin/confessions/${id}/approve`, {
        moderatorId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin_confessions_pending']
      });
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
    }
  });
};

export const useRejectConfession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      moderatorId
    }: {
      id: string;
      moderatorId: string;
    }) => {
      return BaseRequest.Put(`api/admin/confessions/${id}/reject`, {
        moderatorId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin_confessions_pending']
      });
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
    }
  });
};

// Admin Premium Packages
export const useAdminPremiumPackages = () => {
  return useQuery({
    queryKey: ['admin_premium_packages'],
    queryFn: async () => {
      return BaseRequest.Get('api/admin/premium-packages');
    }
  });
};

export const useAdminPremiumPackage = (id: string) => {
  return useQuery({
    queryKey: ['admin_premium_package', id],
    queryFn: async () => {
      return BaseRequest.Get(`api/admin/premium-packages/${id}`);
    },
    enabled: !!id
  });
};

export const useCreatePremiumPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return BaseRequest.Post('api/admin/premium-packages', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_premium_packages'] });
    }
  });
};

export const useUpdatePremiumPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return BaseRequest.Put(`api/admin/premium-packages/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin_premium_packages'] });
      queryClient.invalidateQueries({
        queryKey: ['admin_premium_package', variables.id]
      });
    }
  });
};

export const useDeletePremiumPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return BaseRequest.Delete(`api/admin/premium-packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_premium_packages'] });
    }
  });
};

// Admin Template Categories
export const useAdminTemplateCategories = () => {
  return useQuery({
    queryKey: ['admin_template_categories'],
    queryFn: async () => {
      return BaseRequest.Get('api/admin/template-categories');
    }
  });
};

export const useAdminTemplateCategory = (id: string) => {
  return useQuery({
    queryKey: ['admin_template_category', id],
    queryFn: async () => {
      return BaseRequest.Get(`api/admin/template-categories/${id}`);
    },
    enabled: !!id
  });
};

export const useCreateTemplateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return BaseRequest.Post('api/admin/template-categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin_template_categories']
      });
    }
  });
};

export const useUpdateTemplateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return BaseRequest.Put(`api/admin/template-categories/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin_template_categories']
      });
      queryClient.invalidateQueries({
        queryKey: ['admin_template_category', variables.id]
      });
    }
  });
};

export const useDeleteTemplateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return BaseRequest.Delete(`api/admin/template-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin_template_categories']
      });
    }
  });
};

// Admin Templates - Using public endpoint with admin token
export const useAdminTemplates = () => {
  return useQuery({
    queryKey: ['admin_templates'],
    queryFn: async () => {
      // Admin can use public templates endpoint - all templates will be returned
      return BaseRequest.Get('api/templates');
    }
  });
};

export const useAdminTemplate = (id: string) => {
  return useQuery({
    queryKey: ['admin_template', id],
    queryFn: async () => {
      return BaseRequest.Get(`api/admin/templates/${id}`);
    },
    enabled: !!id
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return BaseRequest.Post('api/admin/templates', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_templates'] });
    }
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      formData
    }: {
      id: string;
      formData: FormData;
    }) => {
      return BaseRequest.Put(`api/admin/templates/${id}`, formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin_templates'] });
      queryClient.invalidateQueries({
        queryKey: ['admin_template', variables.id]
      });
    }
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return BaseRequest.Delete(`api/admin/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_templates'] });
    }
  });
};

// Admin Tips - GET endpoints (using public endpoints with admin token)
export const useAdminDailyTips = () => {
  return useQuery({
    queryKey: ['admin_daily_tips'],
    queryFn: async () => {
      return BaseRequest.Get('api/tips/daily');
    }
  });
};

export const useAdminLibraryTips = () => {
  return useQuery({
    queryKey: ['admin_library_tips'],
    queryFn: async () => {
      return BaseRequest.Get('api/tips/library');
    }
  });
};

// Admin Tips - CRUD
export const useCreateDailyTip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return BaseRequest.Post('api/admin/tips/daily', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin_daily_tips'] });
    }
  });
};

export const useUpdateDailyTip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return BaseRequest.Put(`api/admin/tips/daily/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin_daily_tips'] });
    }
  });
};

export const useDeleteDailyTip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return BaseRequest.Delete(`api/admin/tips/daily/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin_daily_tips'] });
    }
  });
};

export const useCreateLibraryTip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return BaseRequest.Post('api/admin/tips/library', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin_library_tips'] });
    }
  });
};

export const useUpdateLibraryTip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return BaseRequest.Put(`api/admin/tips/library/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin_library_tips'] });
    }
  });
};

export const useDeleteLibraryTip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return BaseRequest.Delete(`api/admin/tips/library/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin_library_tips'] });
    }
  });
};
