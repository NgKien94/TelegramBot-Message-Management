import { Badge } from '@radix-ui/themes';
import { EyeOpenIcon } from '@radix-ui/react-icons';

export default function Users() {
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
            <tr className='text-center'>
              <td className="border border-gray-400 px-4 py-2">11</td>
              <td className="border border-gray-400 px-4 py-2">ngkien94</td>
              <td className="border border-gray-400 px-4 py-2">Nguyễn</td>
              <td className="border border-gray-400 px-4 py-2">Kiên</td>
              <td className="border border-gray-400 px-4 py-2 cursor-pointer">
                <Badge color='green' size='2'>
                  <EyeOpenIcon />
                  View conversation
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
