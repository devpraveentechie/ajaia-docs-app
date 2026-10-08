"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function UserSwitcher() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [currentUser, setCurrentUser] =
    useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) =>
        response.json(),
      )
      .then(setUsers);
  }, []);

  async function switchUser(
    userId: string,
  ) {
    await fetch(
      "/api/auth/switch",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      },
    );

    const selected = users.find(
      (user) => user.id === userId,
    );

    setCurrentUser(
      selected?.name ?? "",
    );

    window.location.href =
      "/dashboard";
  }

  return (
    <select
      value={currentUser}
      onChange={(event) =>
        switchUser(event.target.value)
      }
      className="rounded-md border px-3 py-2 text-sm"
    >
      <option value="">
        Switch User
      </option>

      {users.map((user) => (
        <option
          key={user.id}
          value={user.id}
        >
          {user.name}
        </option>
      ))}
    </select>
  );
}