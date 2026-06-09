import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import LiveBuurt from "../components/LiveBuurt";

export default function Stad({ name }) {
  const [huizen, setHuizen] = useState([]);
  const [berichten, setBerichten] = useState([]);
  const [message, setMessage] = useState("");
  const [tijd, setTijd] = useState(Date.now());
  const [activeHouseIds, setActiveHouseIds] = useState([]);

  const cityStartDate = new Date("2026-05-18");

  



  useEffect(() => {
    getHouses();
    getBerichten();

    const channel = supabase
      .channel("realtime-houses")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "houses",
        },
        () => {
          getHouses();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guestbook",
        },
        () => {
          getBerichten();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTijd(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

async function getHouses() {
  const { data, error } = await supabase
    .from("houses")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Fout bij huizen ophalen:", error);
    return;
  }

  setHuizen(data || []);
}

  async function getBerichten() {
    const { data } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false });

    setBerichten(data || []);
  }

  async function addBericht(e) {
    e.preventDefault();

    if (message.trim() === "") return;

    await supabase.from("guestbook").insert([
      {
        name: name || "Anoniem",
        message: message,
      },
    ]);

    setMessage("");
    getBerichten();
  }

  function HouseDesign({ huis, index, isBeingVisited }) {
    const styles = [
      { icon: "🌐", label: "HOME PAGE" },
      { icon: "💾", label: "WEB ZONE" },
      { icon: "⭐", label: "COOL LINKS" },
      { icon: "🖱️", label: "CYBER HOME" },
      { icon: "🔥", label: "LINK CITY" },
      { icon: "💿", label: "NET STREET" },
    ];

    const style = styles[index % styles.length];
    const bgColor = huis.house_color || "#ffffff";

    function isDarkColor(hex) {
      const color = hex.replace("#", "");
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      return brightness < 160;
    }

    const textColor = isDarkColor(bgColor)
      ? "#efefefff"
      : "#222222";

    return (
      <div
        className={`
          w-64 h-24 border-4
          flex items-center justify-center
          hover:scale-110
          transition-all
          duration-300
          ${isBeingVisited ? "scale-105 animate-pulse" : ""}
        `}
        style={{
          backgroundColor: bgColor,
          borderColor: isBeingVisited ? "#ffffffff" : "#fffefeff",
          borderWidth: isBeingVisited ? "2px" : "2px",
          color: textColor,
          boxShadow: isBeingVisited
            ? "0 0 15px #ffffffff, 0 0 35px #ffffffff, 0 0 60px #1e00ffff"
            : "0 10px 15px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex items-center gap-3 px-3">
          <div className="text-4xl">
            {style.icon}
          </div>

          <div className="text-center leading-none">
            <p className="text-xl font-black">
              {huis.name}
            </p>

            <p className="text-sm font-bold mt-2">
              {isBeingVisited ? "WORDT BEZOCHT 👀" : style.label}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const diff = tijd - cityStartDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div>
      <LiveBuurt
  name={name}
  onActiveHouseIdsChange={setActiveHouseIds}
/>

      <div
        className="min-h-screen min-w-screen bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/Frontpage.png')",
      }}
      >
        <h1 className="text-8xl font-black text-center pt-10 mb-20 text-white">
          WELKOM OP HET INTERNET WAAR JE JE WEER THUIS VOELT
        </h1>

        <div className="flex justify-center gap-16 mb-16 flex-wrap">

  <Link
    to="/"
    className="
      flex
      flex-col
      items-center
      hover:scale-110
      transition-transform
    "
  >
    <div className="text-6xl">
      📦
    </div>

    <span className="
      bg-white
      px-2
      py-1
      text-black
      text-sm
      mt-2
    ">
      ↖ STARTPAGINA
    </span>
  </Link>

  <a
    href="https://archive.org"
    target="_blank"
    rel="noreferrer"
    className="
      flex
      flex-col
      items-center
      hover:scale-110
      transition-transform
    "
  >
    <div className="text-6xl">
      📄
    </div>

    <span className="
      bg-white
      px-2
      py-1
      text-black
      text-sm
      mt-2
    ">
      ↖ RESEARCH
    </span>
  </a>

  <a
    href="https://radio.garden"
    target="_blank"
    rel="noreferrer"
    className="
      flex
      flex-col
      items-center
      hover:scale-110
      transition-transform
    "
  >
    <div className="text-6xl">
      🌐
    </div>

    <span className="
      bg-white
      px-2
      py-1
      text-black
      text-sm
      mt-2
    ">
      ↖ PORTFOLIO
    </span>
  </a>

</div>

        <div className="relative w-full px-10">
          <div className="relative flex flex-wrap justify-center gap-x-20 gap-y-16 pb-20">
            {huizen.map((huis, index) => {
              const isBeingVisited = activeHouseIds.includes(
                String(huis.id)
              );

              return (
                <Link
                  to={`/huisje/${huis.id}`}
                  key={huis.id}
                  className={`
                    relative flex flex-col items-center
                    cursor-pointer
                    ${index % 2 === 0 ? "mt-0" : "mt-20"}
                  `}
                >
                  <HouseDesign
                    huis={huis}
                    index={index}
                    isBeingVisited={isBeingVisited}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10 pb-20 items-start">
          <div className="bg-gray-300 border-2 border-black">
  <div className="bg-blue-700 border-b-2 border-black px-2 py-1 flex justify-between items-center">
    <p className="font-bold text-sm text-white">
      GASTENBOEK.EXE
    </p>

    <span className="bg-gray-200 border border-black px-2 text-black font-bold">
      ×
    </span>
  </div>

  <div className="p-6 h-[650px] overflow-y-auto">
    <form onSubmit={addBericht} className="mb-8">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Laat een bericht achter..."
        className="
          w-full
          p-4
          border-2
          border-black
          bg-white
          text-black
          mb-4
          min-h-32
        "
      />

      <button
        type="submit"
        className="
          bg-blue-700
          border-2
          border-black
          text-white
          px-6
          py-3
          hover:scale-105
          transition-transform
          cursor-pointer
        "
      >
        Bericht plaatsen
      </button>
    </form>

    <div className="space-y-4">
      {berichten.map((bericht) => (
        <div
          key={bericht.id}
          className="bg-white border-2 border-black"
        >
          <div className="bg-blue-700 px-2 py-1 text-white text-sm font-bold">
            {bericht.name}
          </div>

          <div className="p-4">
            <p className="text-xl text-black mb-2">
              {bericht.message}
            </p>

            <p className="text-xs opacity-60">
              {new Date(
                bericht.created_at
              ).toLocaleString("nl-NL")}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

          <div className="bg-gray-300 border-2 border-black">
  <div className="bg-blue-700 border-b-2 border-black px-2 py-1 flex justify-between items-center">
    <p className="font-bold text-sm text-white">
      STATS.EXE
    </p>

    <span className="bg-gray-200 border border-black px-2 text-black font-bold">
      ×
    </span>
  </div>

  <div className="p-6 text-center h-[650px] flex flex-col">
    <p className="text-xl text-black mb-2">
      Bewoners
    </p>

    <p className="text-8xl font-black text-blue-700 mb-8">
      {
        new Set(
          huizen.map((huis) =>
            huis.name?.toLowerCase().trim()
          )
        ).size
      }
    </p>

    <p className="text-xl text-black mb-8">
      unieke internetverhuizers
    </p>

    <div className="border-t-2 border-black pt-8">
      <p className="text-xl text-black mb-6">
        Stad bestaat al
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-6xl font-black text-pink-600">
            {days}
          </p>
          <p>dagen</p>
        </div>

        <div>
          <p className="text-6xl font-black text-pink-600">
            {hours}
          </p>
          <p>uren</p>
        </div>

        <div>
          <p className="text-6xl font-black text-pink-600">
            {minutes}
          </p>
          <p>minuten</p>
        </div>

        <div>
          <p className="text-6xl font-black text-pink-600">
            {seconds}
          </p>
          <p>seconden</p>
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}