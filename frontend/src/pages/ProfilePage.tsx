import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PageHeader } from '../components/PageHeader';
import { api, apiMessage } from '../lib/api';
import type { User } from '../types/api';

const schema = z.object({
  fullName: z.string().min(2).max(160),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  avatarUrl: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get<User>('/profile/me')).data
  });
  const updateProfile = useMutation({
    mutationFn: async (values: FormValues) =>
      (
        await api.put<User>('/profile/me', {
          fullName: values.fullName,
          profile: {
            phone: values.phone,
            address: values.address,
            dateOfBirth: values.dateOfBirth || undefined,
            avatarUrl: values.avatarUrl
          }
        })
      ).data,
    onSuccess: () => {
      toast.success('Profile saved');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not save profile'))
  });

  useEffect(() => {
    if (profile.data) {
      reset({
        fullName: profile.data.fullName,
        phone: profile.data.profile?.phone ?? '',
        address: profile.data.profile?.address ?? '',
        dateOfBirth: profile.data.profile?.dateOfBirth ?? '',
        avatarUrl: profile.data.profile?.avatarUrl ?? ''
      });
    }
  }, [profile.data, reset]);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Personal contact information" />

      <form className="panel grid max-w-3xl gap-4 p-5 sm:grid-cols-2" onSubmit={handleSubmit((values) => updateProfile.mutate(values))}>
        <label className="block sm:col-span-2">
          <span className="label">Full Name</span>
          <input className="input mt-1" {...register('fullName')} />
        </label>
        <label className="block">
          <span className="label">Phone</span>
          <input className="input mt-1" {...register('phone')} />
        </label>
        <label className="block">
          <span className="label">Date of Birth</span>
          <input className="input mt-1" type="date" {...register('dateOfBirth')} />
        </label>
        <label className="block sm:col-span-2">
          <span className="label">Address</span>
          <input className="input mt-1" {...register('address')} />
        </label>
        <label className="block sm:col-span-2">
          <span className="label">Avatar URL</span>
          <input className="input mt-1" {...register('avatarUrl')} />
        </label>
        <button className="btn-primary sm:col-span-2" disabled={formState.isSubmitting || updateProfile.isPending}>
          <Save className="h-4 w-4" />
          Save Profile
        </button>
      </form>
    </div>
  );
}
