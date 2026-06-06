import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function LiveBuurt({
  name,
  houseOwner,
  houseId,
  onActiveHouseIdsChange,
}) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const userName = name || "Anonieme bezoeker";

    const channel = supabase.channel("stad-live", {
      config: {
        presence: {
          key: `${userName}-${Math.random()}`,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();

        setOnlineUsers(users);
        const houseIds = users
  .filter((user) => user.houseId)
  .map((user) => String(user.houseId));

if (onActiveHouseIdsChange) {
  onActiveHouseIdsChange(houseIds);
}
      })
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        setCursors((prev) => ({
          ...prev,
          [payload.name]: payload,
        }));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            name: userName,
            page: window.location.pathname,
            houseOwner: houseOwner || null,
            houseId: houseId || null,
            online_at: new Date().toISOString(),
          });
        }
      });

    let lastSent = 0;

function handleMouseMove(e) {
  const now = Date.now();

  if (now - lastSent < 16) return;
  lastSent = now;

  channel.send({
    type: "broadcast",
    event: "cursor",
    payload: {
      name: userName,
      x: e.clientX,
      y: e.clientY,
    },
  });
}

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      supabase.removeChannel(channel);
    };
  }, [name, houseOwner, houseId]);

  useEffect(() => {
    getMessages();

    const chatChannel = supabase
      .channel("stad-chat-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "stad_chat",
        },
        () => {
          getMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, []);

  async function getMessages() {
  const halfHourAgo = new Date(
    Date.now() - 30 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("stad_chat")
    .select("*")
    .gte("created_at", halfHourAgo)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Fout bij chat ophalen:", error);
    return;
  }

  setMessages(data || []);
}

useEffect(() => {
  const interval = setInterval(() => {
    getMessages();
  }, 60 * 1000);

  return () => clearInterval(interval);
}, []);

  async function sendMessage(e) {
    e.preventDefault();

    if (!chatMessage.trim()) return;

    const { error } = await supabase.from("stad_chat").insert({
      name: name || "Anonieme bezoeker",
      message: chatMessage,
    });

    if (error) {
      console.error("Fout bij bericht sturen:", error);
      return;
    }

    setChatMessage("");
    getMessages();
  }

  function getPageText(user) {
    const page = user.page;

    if (page === "/") return "is bij de voordeur";
    if (page === "/inpakken") return "is aan het inpakken";
    if (page === "/customizen") return "is een huisje aan het maken";
    if (page === "/stad") return "loopt door de stad";

    if (page && page.includes("/huisje/")) {
      return `bezoekt huisje van ${user.houseOwner || "iemand"}`;
    }

    return "is ergens op de site";
  }

  function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
     {Object.values(cursors).map((cursor) => (
  <div
    key={cursor.name}
    className="
      fixed
      pointer-events-none
      z-[9999]
      flex
      items-center
      gap-2
    "
    style={{
      left: cursor.x,
      top: cursor.y,
    }}
  >
    <div
      style={{
        fontSize: "32px",
        color: "white",
        filter: `
          drop-shadow(0 0 2px #60a5fa)
          drop-shadow(0 0 4px #60a5fa)
        `,
      }}
    >
      ↖︎
    </div>

    <span
      className="
        px-2
        py-1
        rounded-full
        text-sm
        font-bold
      "
      style={{
        backgroundColor: "rgba(59,130,246,0.2)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(96,165,250,0.4)",
        color: "white",
      }}
    >
      {cursor.name}
    </span>
  </div>
))}

      <div className="fixed bottom-4 left-4 z-50 bg-white border-2 border-black text-black w-80 shadow-2xl">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-blue-700 text-white border-b-2 border-black p-3 font-black text-left flex justify-between items-center cursor-pointer"
        >
          <span>
            INTERNET BUREN LIVE ({onlineUsers.length})
          </span>

          <span>
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div className="p-4">
            <div className="mb-4">
              <p className="font-bold mb-2">
                Nu online:
              </p>

              {onlineUsers.map((user, index) => (
                <p key={index} className="text-sm">
                  ● {user.name} {getPageText(user)}
                </p>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2 mb-3">
              <input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Zeg iets tegen de buren..."
                className="border-2 border-black p-2 text-sm w-full"
              />

              <button
                type="submit"
                className="bg-blue-700 text-white border-2 border-black px-3 cursor-pointer"
              >
                Stuur
              </button>
            </form>

            <div className="max-h-40 overflow-y-auto text-sm">
              {messages.map((msg) => (
                <div key={msg.id} className="border-b border-black py-2">
                  <div className="flex justify-between gap-2">
                    <strong>{msg.name}</strong>

                    <span className="text-xs opacity-60">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>

                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}