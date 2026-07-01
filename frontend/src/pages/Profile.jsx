import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { fetchProfile } from '../features/auth/authSlice';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: user?.name, password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const payload = { name: data.name };
      if (data.password) payload.password = data.password;
      await authService.updateProfile(payload);
      dispatch(fetchProfile());
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your account details</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-gray-400 capitalize">{user?.role} · {user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
          <Input label="Email" value={user?.email} disabled className="opacity-60" />
          <Input label="New Password (leave blank to keep current)" type="password" {...register('password')} />
          <Button type="submit" loading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
