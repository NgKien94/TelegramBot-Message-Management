import { getMe, logout } from '@message-management/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Setting() {
  const navigate = useNavigate();
  const access_token = localStorage.getItem('access_token');
  const queryClient = useQueryClient();

  const { isSuccess, data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getMe(),
    enabled: Boolean(access_token),
  });

  const logoutMutation = useMutation({
    mutationFn: (body: { token: string }) => logout(body),
    onSuccess: () => {
      toast.success('Logout successfully');
      queryClient.clear();
    },
    onError: () => {
      toast.error('Logout failed');
    },
  });

  const handleLogout = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    try {
      if (refresh_token) {
        // sync with server
        await logoutMutation.mutateAsync({ token: refresh_token });

        // remove token in client storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      }
    } catch (error) {
      console.log('Logout error: ', error);
      return;
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-2xl space-y-8 text-sm text-gray-600">

        {/* Account */}
        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            Account
          </h2>

          <div className="rounded-lg border bg-white">
            <div className="flex justify-between p-4 border-b">
              <span>Email</span>
              <span className="font-medium text-gray-900">
                {isSuccess ? data.result.email : "Unknown"}
              </span>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            Settings
          </h2>

          <div className="rounded-lg border bg-white divide-y">
            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <p className="font-medium text-gray-800">Privacy & Security</p>
              <p className="text-gray-500 text-xs">
                Manage password, sessions and security options
              </p>
            </div>

            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <p className="font-medium text-gray-800">Help & Support</p>
              <p className="text-gray-500 text-xs">
                Documentation and support resources
              </p>
            </div>

            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <p className="font-medium text-gray-800">
                Display & Accessibility
              </p>
              <p className="text-gray-500 text-xs">
                Adjust appearance and accessibility
              </p>
            </div>

            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <p className="font-medium text-gray-800">Activity Log</p>
              <p className="text-gray-500 text-xs">
                Review recent account activity
              </p>
            </div>
          </div>
        </section>

        {/* Logout */}
        <section>
          <button
            onClick={handleLogout}
            className="text-red-600 text-sm hover:underline"
          >
            Logout
          </button>
        </section>
      </div>
    </div>
  );
}
