import { EyeOpenIcon, PersonIcon } from '@radix-ui/react-icons';
// import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@radix-ui/themes';
import { useEffect } from 'react';
import { useAppContext } from '../../contexts/global.context';

export default function Users() {
  const navigate = useNavigate();
  const { users, loadUsers } = useAppContext();

  const handleViewConversation = (conversation: { id: string }) => {
    navigate(`/conversations/${conversation.id}`);
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary-color)] opacity-80">
          Management
        </p>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-400">{users.length} users total</p>
      </div>

      {/* Table card */}
      <div className="overflow-hidden  rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* {isLoading && (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            <Loading />
          </div>
        )} */}

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              <th className="px-5 py-3.5">Telegram ID</th>
              <th className="px-5 py-3.5">Username</th>
              <th className="px-5 py-3.5">First name</th>
              <th className="px-5 py-3.5">Last name</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length > 0 &&
              users.map((item, index) => (
                <tr key={item.telegramID} className="group transition-colors hover:bg-[var(--primary-color)]/5">
                  {/* Avatar + ID */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                        <PersonIcon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-gray-700">{item.telegramID}</span>
                    </div>
                  </td>
                  {/* Username */}
                  <td className="px-5 py-3.5">
                    {item.username ? (
                      <span className="font-medium text-gray-800">@{item.username}</span>
                    ) : (
                      <Badge color="red">Not registered</Badge>
                    )}
                  </td>
                  {/* Firstname */}
                  <td className="px-5 py-3.5 text-gray-700">
                    {item.firstName ?? <span className="text-gray-300 italic">—</span>}
                  </td>
                  {/* Last name */}
                  <td className="px-5 py-3.5 text-gray-700">
                    {item.lastName ?? <span className="text-gray-300 italic">—</span>}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      // onClick={() => handleViewConversation(item.conversation)}
                      onClick={() => handleViewConversation(item.conversation)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--primary-color)]/30 bg-[var(--primary-color)]/5 px-3 py-1.5 text-xs font-semibold text-[var(--primary-color)] transition hover:bg-[var(--primary-color)] hover:text-white"
                    >
                      <EyeOpenIcon className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
