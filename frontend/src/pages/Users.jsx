import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { fetchUsers, createStaffUser, updateStaffUser, deleteStaffUser } from '../features/users/userSlice';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/Skeleton';
import { useConfirm } from '../hooks/useConfirm';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

const Users = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.users);
  const { user: currentUser } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const onCreate = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createStaffUser(data));
    setSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      setFormOpen(false);
      reset();
    }
  };

  const toggleActive = (u) => dispatch(updateStaffUser({ id: u._id, data: { isActive: !u.isActive } }));

  const handleDelete = async (u) => {
    const ok = await confirm({ title: 'Remove Staff Account', message: `Remove ${u.name}'s account? They will lose access immediately.` });
    if (ok) dispatch(deleteStaffUser(u._id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Accounts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage admin & staff access</p>
        </div>
        <Button icon={Plus} onClick={() => setFormOpen(true)}>
          Add Staff
        </Button>
      </div>

      <div className="card p-5 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100 dark:border-gray-800">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Joined</th>
                <th className="pb-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <td className="py-3 pr-4 font-medium">{u.name}</td>
                  <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                  <td className="py-3 pr-4 capitalize">{u.role}</td>
                  <td className="py-3 pr-4">
                    <Badge className={u.isActive ? 'badge-success' : 'badge-danger'}>{u.isActive ? 'Active' : 'Disabled'}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{formatDate(u.createdAt)}</td>
                  <td className="py-3 pr-4 flex items-center gap-2">
                    <button onClick={() => toggleActive(u)} className="btn-ghost !px-2 !py-1.5" title={u.isActive ? 'Disable' : 'Enable'}>
                      {u.isActive ? <ShieldOff size={16} className="text-warning-600" /> : <ShieldCheck size={16} className="text-success-600" />}
                    </button>
                    {u._id !== currentUser._id && (
                      <button onClick={() => handleDelete(u)} className="btn-ghost !px-2 !py-1.5 text-danger-600">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add Staff Account">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
          <Input
            label="Temporary Password"
            type="password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
          />
          <Select
            label="Role"
            options={[
              { value: 'staff', label: 'Staff' },
              { value: 'admin', label: 'Admin' },
            ]}
            defaultValue="staff"
            {...register('role')}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog state={confirmState} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
};

export default Users;
