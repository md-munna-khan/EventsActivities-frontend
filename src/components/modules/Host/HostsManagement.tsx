/* eslint-disable @typescript-eslint/no-explicit-any */



import { getAllHosts } from '@/services/host/hostService';
import UpdateHostStatusButton from './UpdateHostStatusButton';
import DeleteHostButton from './DeleteHostButton';

const HostsManagement = async () => {
  const res = await getAllHosts({}, { page: 1, limit: 50 });

  const hosts = res?.data || [];
  console.log(hosts)

  return (
    <div>
      <h2 className="text-2xl font-semibold">Hosts Management</h2>
      {hosts.length === 0 ? (
        <div className="text-muted-foreground">No hosts found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((h: any) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.email}</td>
                  <td>{h.status}</td>
                  <td className="flex gap-2">
                    <UpdateHostStatusButton hostId={h.id} currentStatus={h.status} />
                    <DeleteHostButton hostId={h.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HostsManagement;
