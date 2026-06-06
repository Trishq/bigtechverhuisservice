import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function LiveVisitors({ name }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const channel = supabase.channel("online-users");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();

        const users = Object.values(state)
          .flat()
          .map((user) => user.name);

        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            name: name || "Anonieme bezoeker",
            page: window.location.pathname,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [name]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-200 border-2 border-blue-600 p-4 z-50 text-blue-600 max-w-xs">
      <p className="font-bold mb-2">
        Nu online: {onlineUsers.length}
      </p>

      {onlineUsers.map((user, index) => (
        <p key={index}>● {user}</p>
      ))}
    </div>
  );
}