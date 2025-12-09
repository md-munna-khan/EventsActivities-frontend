/* components/modules/admin/ClientsManagement.tsx */
import React from "react";

import UpdateStatusButton from "./UpdateStatusButton.client";
import DeleteButton from "./DeleteButton.client";
import { getAllUsers } from "@/services/user/userService";

type User = {
  id: string;
  email?: string | null;
  role?: string | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const ClientsManagement = async () => {
  const res = await getAllUsers({ role: "CLIENT" }, { page: 1, limit: 50 });
  const users: User[] = Array.isArray(res?.data) ? res.data : [];

  if (!res || res.success === false) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Clients Management</h2>
        <div className="mt-4 text-red-600">Failed to load clients: {res?.message ?? "Unknown error"}</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Clients Management</h2>

      {users.length === 0 ? (
        <div className="mt-4 text-muted-foreground">No clients found</div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-md border">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="pl-4">Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="pl-4">{u.email ?? "-"}</td>
                  <td>{u.role ?? "-"}</td>
                  <td>{u.status ?? "-"}</td>
                  <td className="flex justify-end gap-2 pr-4">
                    <UpdateStatusButton resource="users" id={u.id} currentStatus={u.status ?? "ACTIVE"} />
                    <DeleteButton resource="users" id={u.id} />
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

export default ClientsManagement;
