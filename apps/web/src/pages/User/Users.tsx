import { Badge } from '@radix-ui/themes';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@message-management/client';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const navigate = useNavigate()

  const { isSuccess, data } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  return (
    <div className="flex justify-center py-10 text-sm">
      <div className="space-y-5 w-full max-w-2xl">
        <h2 className="text-2xl text-[var(--primary-color)] font-semibold text-center">User Management</h2>
        <table className="border-collapse border w-full">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2 font-semibold">TelegramID</th>
              <th className="border border-gray-400 px-4 py-2 font-semibold">Username</th>
              <th className="border border-gray-400 px-4 py-2 font-semibold">First name</th>
              <th className="border border-gray-400 px-4 py-2 font-semibold">Last name</th>
              <th className="border border-gray-400 px-4 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {isSuccess &&
              data.result.map((item) => (
                <tr className="text-center" key={item.telegramID}>
                  <td className="border border-gray-400 px-4 py-2">{item.telegramID}</td>
                  <td className="border border-gray-400 px-4 py-2">{item.username ? item.username: <span className='text-red-500'>Not register</span>}</td>
                  <td className="border border-gray-400 px-4 py-2">{item.firstName ? item.firstName: <span className='text-red-500'>Not register</span>}</td>
                  <td className="border border-gray-400 px-4 py-2">{item.lastName ? item.lastName: <span className='text-red-500'>Not register</span>}</td>
                  <td className="border border-gray-400 px-4 py-2 cursor-pointer">
                    <Badge color="green" size="2" onClick={() => navigate(`/conversations/${item.conversation.id}`)}>
                      <EyeOpenIcon />
                      View conversation
                    </Badge>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
