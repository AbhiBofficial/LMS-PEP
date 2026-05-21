import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Save, User } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PageHeader } from '../components/PageHeader';
import { PageLoader } from '../components/LoadingSpinner';
import { api, apiMessage } from '../lib/api';
import { getInitials } from '../lib/utils';
import { useAuthStore } from '../store/auth';
import type { User as UserType } from '../types/api';

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
  const authUser = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get<UserType>('/profile/me')).data
  });
  const updateProfile = useMutation({
    mutationFn: async (values: FormValues) =>
      (
        await api.put<UserType>('/profile/me', {
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
      toast.success('Profile saved successfully');
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

  if (profile.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" description="Personal contact information" />
        <PageLoader />
      </div>
    );
  }

  const data = profile.data;
  const initials = getInitials(data?.fullName ?? authUser?.fullName);
  const avatarUrl = data?.profile?.avatarUrl;

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Personal contact information" />

      {/* Profile Header Card */}
      <div className="panel p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={data?.fullName}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <span className="text-2xl font-bold text-primary">{initials}</span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-teal-500 border-2 border-card flex items-center justify-center">
            <User className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl font-bold">{data?.fullName ?? authUser?.fullName}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{data?.email ?? authUser?.email}</p>
          <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
            {roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 flex-shrink-0">
          <div className="text-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 mx-auto mb-1">
              <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-lg font-bold">{data?.activeBorrowCount ?? 0}</p>
            <p className="text-xs text-muted-foreground">Borrowed</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form
        className="panel grid max-w-3xl gap-4 p-5 sm:grid-cols-2"
        onSubmit={handleSubmit((values) => updateProfile.mutate(values))}
        id="profile-form"
      >
        <label className="block sm:col-span-2">
          <span className="label">Full Name</span>
          <input className="input mt-1" {...register('fullName')} id="profile-fullname" />
          {formState.errors.fullName && (
            <p className="text-xs text-destructive mt-1">{formState.errors.fullName.message}</p>
          )}
        </label>
        <label className="block">
          <span className="label">Phone</span>
          <input className="input mt-1" placeholder="+91 …" {...register('phone')} id="profile-phone" />
        </label>
        <label className="block">
          <span className="label">Date of Birth</span>
          <input className="input mt-1" type="date" {...register('dateOfBirth')} id="profile-dob" />
        </label>
        <label className="block sm:col-span-2">
          <span className="label">Address</span>
          <input className="input mt-1" placeholder="Street, City, State" {...register('address')} id="profile-address" />
        </label>
        <label className="block sm:col-span-2">
          <span className="label">Avatar URL</span>
          <input
            className="input mt-1"
            placeholder="https://…"
            {...register('avatarUrl')}
            id="profile-avatar"
          />
          <p className="text-xs text-muted-foreground mt-1">Paste an image URL to use as your avatar</p>
        </label>
        <button
          className="btn-primary sm:col-span-2"
          disabled={formState.isSubmitting || updateProfile.isPending}
          id="save-profile-btn"
        >
          <Save className="h-4 w-4" />
          {updateProfile.isPending ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
