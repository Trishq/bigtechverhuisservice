import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useParams, Link } from "react-router-dom";
import LiveBuurt from "../components/LiveBuurt";

export default function Huisje({ name }) {
  const { id } = useParams();

  const [huis, setHuis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const [archiveLinks, setArchiveLinks] = useState([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [neighborHouses, setNeighborHouses] = useState([]);

  const [stickers, setStickers] = useState([]);
  const [draggingSticker, setDraggingSticker] = useState(null);

 const stickerOptions = [
  "/stickers/Sticker1.png",
  "/stickers/Sticker2.png",
  "/stickers/Sticker3.png",
  "/stickers/Sticker4.png",
];

  const randomWebsites = [
    "https://theuselessweb.com",
    "https://pointerpointer.com",
    "https://neal.fun",
    "https://radio.garden",
    "https://archive.org",
  ];

  useEffect(() => {
    async function getHouse() {
      const { data, error } = await supabase
        .from("houses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setErrorText(error.message);
      } else {
        setHuis(data);
        setStickers(data?.stickers || []);

        await supabase
          .from("houses")
          .update({
            visits: (data.visits || 0) + 1,
          })
          .eq("id", id);
      }

      setLoading(false);
    }

    getHouse();
    loadChatMessages();
    loadArchiveLinks();
    loadNeighborHouses();
  }, [id]);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!draggingSticker) return;

      setStickers((prev) =>
        prev.map((sticker) =>
          sticker.id === draggingSticker.id
            ? {
                ...sticker,
                x: e.clientX - draggingSticker.offsetX,
                y: e.clientY - draggingSticker.offsetY,
              }
            : sticker
        )
      );
    }

    async function handleMouseUp() {
      if (!draggingSticker || !huis) return;

      setDraggingSticker(null);

      setStickers((currentStickers) => {
        supabase
          .from("houses")
          .update({
            stickers: currentStickers,
          })
          .eq("id", huis.id);

        return currentStickers;
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingSticker, huis]);

  async function addSticker(sticker) {
    if (!huis) return;

   const newSticker = {
  id: Date.now(),
  image: sticker,
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

    const updatedStickers = [...stickers, newSticker];

    setStickers(updatedStickers);

    await supabase
      .from("houses")
      .update({
        stickers: updatedStickers,
      })
      .eq("id", huis.id);
  }

  async function removeSticker(stickerId) {
    if (!huis) return;

    const updatedStickers = stickers.filter(
      (sticker) => sticker.id !== stickerId
    );

    setStickers(updatedStickers);

    await supabase
      .from("houses")
      .update({
        stickers: updatedStickers,
      })
      .eq("id", huis.id);
  }

  async function loadChatMessages() {
    const { data } = await supabase
      .from("house_chat_messages")
      .select("*")
      .eq("house_id", id)
      .order("created_at", {
        ascending: true,
      });

    setChatMessages(data || []);
  }

  async function sendChatMessage() {
    if (!chatInput.trim()) return;

    const { error } = await supabase
      .from("house_chat_messages")
      .insert({
        house_id: id,
        message: chatInput,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setChatInput("");
    loadChatMessages();
  }

  async function loadArchiveLinks() {
    const { data } = await supabase
      .from("house_archive_links")
      .select("*")
      .eq("house_id", id)
      .order("created_at", {
        ascending: false,
      });

    setArchiveLinks(data || []);
  }

  async function saveArchiveLink() {
    if (!linkUrl.trim()) return;

    const { error } = await supabase
      .from("house_archive_links")
      .insert({
        house_id: id,
        title: linkTitle,
        url: linkUrl,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setLinkTitle("");
    setLinkUrl("");
    loadArchiveLinks();
  }

  async function loadNeighborHouses() {
    const { data } = await supabase
      .from("houses")
      .select("*")
      .neq("id", id)
      .limit(6);

    if (!data) return;

    const shuffled = data.sort(() => 0.5 - Math.random());

    setNeighborHouses(shuffled);
  }

  function openRandomWebsite() {
    const randomSite =
      randomWebsites[
        Math.floor(Math.random() * randomWebsites.length)
      ];

    window.open(randomSite, "_blank");
  }

  if (loading) {
    return <div className="p-10">Laden...</div>;
  }

  if (errorText) {
    return <div className="p-10">{errorText}</div>;
  }

  if (!huis) {
    return <div className="p-10">Geen internetplek gevonden.</div>;
  }

  const userColor = huis.house_color || "#ff00ff";

  function hexToRgba(hex, opacity) {
    const cleanHex = hex.replace("#", "");

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  function isDarkColor(hex) {
    const color = hex.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 208;
  }

  const panelTextColor = isDarkColor(userColor)
    ? "#ffffff"
    : "#222222";

  const lightUserColor = hexToRgba(userColor, 0.95);
  const mediumUserColor = hexToRgba(userColor, 0.75);
  const extralightUserColor = hexToRgba(userColor, 0.35);
  const strongUserColor = hexToRgba(userColor, 1);

  const pageStyles = {
    hyves: {
      font: "Arial, sans-serif",
    },

    geocities: {
      font: "'Comic Sans MS', cursive",
    },

    msn: {
      font: "Verdana, sans-serif",
    },

    forum: {
      font: "system-ui, sans-serif",
    },
  };

  const currentStyle =
    pageStyles[huis.house_style] || pageStyles.hyves;

  return (
    <div>
      <LiveBuurt
        name={name}
        houseOwner={huis?.name}
        houseId={huis?.id}
      />

      {/* STICKERS OP DE PAGINA */}
      {stickers.map((item) => (
        <div
          key={item.id}
          onMouseDown={(e) => {
            const rect =
              e.currentTarget.getBoundingClientRect();

            setDraggingSticker({
              id: item.id,
              offsetX: e.clientX - rect.left,
              offsetY: e.clientY - rect.top,
            });
          }}
          onDoubleClick={() => removeSticker(item.id)}
          className="
            absolute
            z-10
            text-6xl
            cursor-move
            select-none
            hover:scale-110
            transition-transform
          "
          style={{
            left: item.x,
            top: item.y,
          }}
          title="Sleep mij. Dubbelklik om te verwijderen."
        >
          <img
  src={item.image}
  alt=""
  className="
    w-20
    h-20
    object-contain
    pointer-events-none
  "
/>
        </div>
      ))}

      <div
        className="min-h-screen p-6"
        style={{
          backgroundImage: "url('/achtergrond.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          color: panelTextColor,
          fontFamily: currentStyle.font,
        }}
      >
        <div
          className="max-w-7xl mx-auto shadow-2xl relative"
          style={{
            backgroundColor: mediumUserColor,
            border: `4px solid ${strongUserColor}`,
          }}
        >
          {/* TOPBAR */}
          <div
            className="
              p-4
              flex
              justify-between
              items-center
              text-sm
            "
            style={{
              backgroundColor: strongUserColor,
              color: panelTextColor,
            }}
          >
            <div>
              <h1 className="text-4xl font-black leading-none mb-1">
                Digitale woningcrisis
              </h1>

              <p className="text-sm">
                Waar het oude internet herleeft.
              </p>
            </div>

            <div className="text-right">
              <Link className="hover:underline" to="/">
                Nieuw account
              </Link>

              {" | "}

              <Link className="hover:underline" to="/stad">
                Terug naar de stad
              </Link>
            </div>
          </div>

          {/* HEADER */}
          <div
            className="py-4 border-b px-4"
            style={{
              backgroundColor: extralightUserColor,
              borderColor: strongUserColor,
            }}
          >
            <div className="flex justify-between items-start">
              <h2
                className="text-2xl font-bold text-left ml-5"
                style={{
                  color: panelTextColor,
                }}
              >
                Welkom op het internet-huis van
                <p className="text-5xl">{huis.name}</p>
              </h2>

              <div className="text-right mr-3">
                <p className="text-sm">
                  Je bent bezoeker nummer...
                </p>

                <div className="flex justify-end leading-none">
                  {String(huis.visits || 0)
                    .padStart(3, "0")
                    .split("")
                    .map((digit, index) => (
                      <div
                        key={index}
                        className="text-5xl font-black"
                        style={{
                          color: panelTextColor,
                        }}
                      >
                        {digit}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* STICKERBALK */}
          <div
            className="
              p-4
              border-b-4
              flex
              flex-wrap
              items-center
              gap-3
            "
            style={{
              backgroundColor: lightUserColor,
              borderColor: strongUserColor,
            }}
          >
            <p className="font-black mr-2">
              Plak stickers in dit huisje:
            </p>

           {stickerOptions.map((sticker) => (
  <button
    key={sticker}
    onClick={() => addSticker(sticker)}
    className="
      bg-white
      border-2
      border-black
      p-2
      hover:scale-110
      transition-transform
    "
  >
    <img
      src={sticker}
      alt=""
      className="w-12 h-12 object-contain"
    />
  </button>
))}

            <p className="text-sm opacity-80 ml-2">
              Sleep stickers. Dubbelklik om te verwijderen.
            </p>
          </div>

          {/* MAIN */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-[230px_1fr_250px]
              gap-6
              px-6
              pb-8
              mt-4
            "
          >
            {/* SIDEBAR */}
            <aside
              className="p-4"
              style={{
                backgroundColor: mediumUserColor,
                border: `3px solid ${strongUserColor}`,
              }}
            >
              <div
                className="
                  w-full
                  aspect-square
                  mb-4
                  flex
                  items-center
                  justify-center
                  text-8xl
                "
                style={{
                  backgroundColor: strongUserColor,
                }}
              >
                <img
                  src={huis.profile_picture}
                  alt="profielfoto"
                  className="w-full h-full object-cover border-3"
                  style={{
                    borderColor: strongUserColor,
                  }}
                />
              </div>

              <p className="font-bold text-xl">{huis.name}</p>
            </aside>

            {/* CONTENT */}
            <main
              className="p-0"
              style={{
                backgroundColor: mediumUserColor,
                border: `3px solid ${strongUserColor}`,
              }}
            >
              <div
                className="px-4 py-2 font-bold"
                style={{
                  backgroundColor: strongUserColor,
                }}
              >
                Profiel
              </div>

              <div className="p-4 grid gap-4 text-lg">
                <p>
                  <strong>Vroeger online actief op:</strong>
                  <br />
                  {huis.old_online_place}
                </p>

                <p>
                  <strong>Meegenomen object:</strong>
                  <br />
                  {huis.survival_object}
                </p>

                <p>
                  <strong>
                    Laat achter op het oude internet:
                  </strong>
                  <br />“{huis.old_internet_message}”
                </p>

                <p>
                  <strong>
                    Wat neem ik mee van het internet nu:
                  </strong>
                  <br />
                  {huis.take_from_internet}
                </p>

                <div>
                  <strong>Favoriete internet media:</strong>
                  <br />

                  <div className="flex flex-col gap-4 mt-3">
                    <a
                      href={huis.favorite_internet_media}
                      target="_blank"
                      rel="noreferrer"
                      className="underline break-all"
                    >
                      {huis.favorite_internet_media}
                    </a>

                    {huis.favorite_internet_media?.includes(
                      "youtube.com"
                    ) && (
                      <iframe
                        className="w-full mt-4 aspect-video"
                        src={huis.favorite_internet_media.replace(
                          "watch?v=",
                          "embed/"
                        )}
                        title="YouTube video"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* BROWSER WINDOW */}
              {huis.room_type === "browser_window" && (
                <div
                  className="p-4 border-t"
                  style={{
                    borderColor: strongUserColor,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-3">
                    Random website generator
                  </h3>

                  <button
                    onClick={openRandomWebsite}
                    className="px-5 py-3 font-bold"
                    style={{
                      backgroundColor: strongUserColor,
                      color: panelTextColor,
                    }}
                  >
                    Open random website
                  </button>
                </div>
              )}

              {/* CHATROOM */}
              {huis.room_type === "chatroom" && (
                <div
                  className="p-4 border-t"
                  style={{
                    borderColor: strongUserColor,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-3">
                    Chatroom
                  </h3>

                  <div
                    className="
                      bg-white
                      text-black
                      p-3
                      h-48
                      overflow-y-auto
                      mb-4
                      border-4
                    "
                    style={{
                      borderColor: strongUserColor,
                    }}
                  >
                    {chatMessages.map((msg) => (
                      <p key={msg.id} className="mb-2">
                        💬 {msg.message}
                      </p>
                    ))}
                  </div>

                  <input
                    value={chatInput}
                    onChange={(e) =>
                      setChatInput(e.target.value)
                    }
                    placeholder="Typ een bericht..."
                    className="
                      w-full
                      text-left
                      p-3
                      text-black
                      mb-3
                      bg-white
                    "
                  />

                  <button
                    onClick={sendChatMessage}
                    className="px-5 py-3 font-bold"
                    style={{
                      backgroundColor: panelTextColor,
                      color: strongUserColor,
                    }}
                  >
                    Verstuur
                  </button>
                </div>
              )}

              {/* ARCHIVE */}
              {huis.room_type === "archive" && (
                <div
                  className="p-4 border-t"
                  style={{
                    borderColor: strongUserColor,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-3">
                    Archiefkamer
                  </h3>

                  <input
                    value={linkTitle}
                    onChange={(e) =>
                      setLinkTitle(e.target.value)
                    }
                    placeholder="Titel van je link"
                    className="w-full p-3 mb-3"
                    style={{
                      backgroundColor: panelTextColor,
                      color: strongUserColor,
                    }}
                  />

                  <input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 text-black mb-3"
                    style={{
                      backgroundColor: panelTextColor,
                      color: strongUserColor,
                    }}
                  />

                  <button
                    onClick={saveArchiveLink}
                    className="
                      px-5
                      py-3
                      font-bold
                      mb-4
                      cursor-pointer
                    "
                    style={{
                      backgroundColor: strongUserColor,
                      color: panelTextColor,
                    }}
                  >
                    Link opslaan
                  </button>

                  <div className="grid gap-2">
                    {archiveLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline break-all"
                      >
                        🔗 {link.title || link.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* INTERNET BUREN */}
            <aside
              className="p-4"
              style={{
                backgroundColor: mediumUserColor,
                border: `3px solid ${strongUserColor}`,
              }}
            >
              <div
                className="
                  px-3
                  py-2
                  font-bold
                  mb-4
                  text-lg
                "
                style={{
                  backgroundColor: strongUserColor,
                  color: panelTextColor,
                }}
              >
                Internet buren
              </div>

              <div className="grid grid-cols-2 gap-4">
                {neighborHouses.map((neighbor) => (
                  <Link
                    key={neighbor.id}
                    to={`/huisje/${neighbor.id}`}
                    className="
                      flex
                      flex-col
                      items-center
                      gap-2
                      hover:scale-105
                      transition-transform
                    "
                  >
                    <div
                      className="
                        w-20
                        h-20
                        overflow-hidden
                        border-4
                      "
                      style={{
                        borderColor: strongUserColor,
                      }}
                    >
                      <img
                        src={neighbor.profile_picture}
                        alt={neighbor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-sm text-center break-words">
                      {neighbor.name}
                    </p>
                  </Link>
                ))}
              </div>
            </aside>
          </div>

          <div className="flex justify-center py-8">
            <Link
              to="/stad"
              className="
                bg-blue-600
                text-white
                text-2xl
                font-black
                px-10
                py-5
                border-4
                border-black
                shadow-xl
                hover:scale-110
                transition-transform
              "
            >
              🏘️ TERUG NAAR DE STAD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}