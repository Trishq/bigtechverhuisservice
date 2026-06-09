import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const popupItems = [
  {
    key: "claimBackWeb",
    title: "CLAIM BACK THE WEB",
    image: "/popups/popup1.png",
    text: "Verhuis vandaag nog naar iets beters",
    buttonText: "BEGRIJP IK",
  },
  {
    key: "myPhoneMyHome",
    title: "MY PHONE MY HOME",
    image: "/popups/popup2.gif",
    text: "Hier wil je wel online komen wonen.",
    buttonText: "LAAT ME MET RUST",
  },
  {
    key: "verhuisJeData",
    title: "ALERT - VERHUIS JE DATA",
    image: "/popups/popup3.gif",
    text: "Je data wordt ingepakt...",
    buttonText: "NIET MIJN DATA",
  },
];

export default function Home({ name, setName }) {
  const navigate = useNavigate();

  const [popups, setPopups] = useState([]);
  const [availablePopups, setAvailablePopups] = useState(popupItems);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPopups((prev) => {
        if (prev.length >= 3) return prev;
        if (availablePopups.length === 0) return prev;

        const alreadyVisibleKeys = prev.map((popup) => popup.key);

        const possiblePopups = availablePopups.filter(
          (popup) => !alreadyVisibleKeys.includes(popup.key)
        );

        if (possiblePopups.length === 0) return prev;

        const randomPopup =
          possiblePopups[Math.floor(Math.random() * possiblePopups.length)];

        const newPopup = {
          ...randomPopup,
          id: `${randomPopup.key}-${Date.now()}`,
          x: Math.random() * 65 + 5,
          y: Math.random() * 55 + 15,
        };

        return [...prev, newPopup];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [availablePopups]);

  function closePopup(id, key) {
    setPopups((prev) => prev.filter((popup) => popup.id !== id));

    setAvailablePopups((prev) =>
      prev.filter((popup) => popup.key !== key)
    );
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!dragging) return;

      setPopups((prev) =>
        prev.map((popup) =>
          popup.id === dragging.id
            ? {
                ...popup,
                x: Math.max(
                  0,
                  Math.min(
                    80,
                    ((e.clientX - dragging.offsetX) / window.innerWidth) * 100
                  )
                ),
                y: Math.max(
                  5,
                  Math.min(
                    80,
                    ((e.clientY - dragging.offsetY) / window.innerHeight) * 100
                  )
                ),
              }
            : popup
        )
      );
    }

    function handleMouseUp() {
      setDragging(null);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const reviews = [
  {
    name: "@ElonMusk",
    text: "Blijf pls! Zonder jullie kan ik geen data meer verkopen",
  },
  {
    name: "@xXx_appeltje_xXx",
    text: "Eindelijk een internet wat weer voelt als eerst! Echt een aanrader voor iedereen die klaar is met de grote techbedrijven!",
  },
  {
    name: "@anonieme_verhuizer",
    text: "Wat een snelle service dankzij de Big Tech Verhuis Service. Alles was zo geregeld en mijn digitale leven is nu veel overzichtelijker.",
  },
];

  return (
    <div
      className="min-h-screen min-w-screen bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/Frontpage.png')",
      }}
    >
      {/* POPUPS */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute w-80 bg-gray-300 border-2 border-black shadow-2xl z-[60]"
          style={{
            left: `${popup.x}%`,
            top: `${popup.y}%`,
          }}
        >
          <div
            className="
              bg-blue-700
              border-b-2
              border-black
              px-2
              py-1
              flex
              justify-between
              items-center
              cursor-move
            "
            onMouseDown={(e) => {
              const rect =
                e.currentTarget.parentElement.getBoundingClientRect();

              setDragging({
                id: popup.id,
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top,
              });
            }}
          >
            <p className="font-bold text-sm text-white">
              {popup.title}
            </p>

            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => closePopup(popup.id, popup.key)}
              className="bg-gray-200 border border-black px-2 text-black font-bold cursor-pointer"
            >
              ×
            </button>
          </div>

          <div className="p-3 text-black">
            <img
              src={popup.image}
              alt={popup.title}
              className="w-full h-40 object-cover border border-black mb-3"
            />

            <input
              placeholder={popup.text}
              className="w-full border border-black p-2 mb-2 text-sm"
              readOnly
            />

            <button
              type="button"
              onClick={() => closePopup(popup.id, popup.key)}
              className="
                w-full
                bg-blue-600
                border
                border-black
                p-2
                font-bold
                cursor-pointer
                text-white
              "
            >
              {popup.buttonText || "OK"}
            </button>
          </div>
        </div>
      ))}

      {/* SCROLLENDE BALK */}
      <div
        className="
          absolute
          top-0
          left-0
          w-full
          h-14
          bg-black
          border-b-2
          border-black
          overflow-hidden
          z-50
          flex
          items-center
        "
      >
        <div
          className="whitespace-nowrap text-white font-bold text-xl"
          style={{
            animation: "marquee 20s linear infinite",
          }}
        >
          ⓘ NEEM AFSCHEID VAN BIG TECH ⓘ
          {"\u00A0".repeat(30)}
          𖠿 VERHUIS JE DIGITALE LEVEN 𖠿
          {"\u00A0".repeat(30)}
          ➥ PAK JE FAVORIETE HERINNERINGEN IN ➥
          {"\u00A0".repeat(30)}
          ⓘ BOUW JE EIGEN INTERNET-HUIS ⓘ
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <img
          src="/Middel.png"
          alt="foto"
          className="absolute top-8 right-8 w-90 z-50"
        />

        <img
          src="/Logo1.png"
          alt="Logo"
          className="w-4xl mb-4 mt-20 z-10"
        />

        <h1 className="max-w-220 text-[60px] mb-12 leading-[0.9] text-white">
          We helpen je afscheid nemen van Big Tech
          Platformen waar je gevangen zit.
        </h1>

        <p className="max-w-220 text-[50px] mb-12 leading-[0.9] text-white">
          Neem je favoriete dingen mee naar je nieuwe digitale huis.
          Vul je naam in en begin met inpakken.
        </p>

        <div className="bg-gray-300 border-black border-2 p-8 shadow-2xl w-full max-w-100 mb-24 z-10">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vul je gebruikersnaam in."
            className="w-full p-4 text-1xl border-gray-600 border-2 mb-6 text-black bg-white"
          />

          <img
            src="/Middel2.png"
            alt="foto"
            className="absolute top-172 left-8 w-90 z-50"
          />

          <button
            type="button"
            onClick={() => navigate("/inpakken")}
            className="bg-blue-700 text-white px-8 py-4 w-full border-black border-1 cursor-pointer hover:scale-105 transition-transform"
          >
            Klaar om te verhuizen?
          </button>
        </div>

        {/* REVIEWS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full max-w-6xl mb-16 z-10">
  {reviews.map((review, index) => (
    <div
      key={index}
      className="
        bg-gray-300
        border-2
        border-black
        text-black
      "
    >
      <div
        className="
          bg-blue-700
          border-b-2
          border-black
          px-2
          py-1
          flex
          justify-between
          items-center
        "
      >
        <p className="font-bold text-[18px] text-white text-left">
          REVIEW
        </p>

        <span className="bg-gray-200 border border-black px-2 text-black font-bold">
          ×
        </span>
      </div>

      <div className="p-4 text-left">
        <p className="text-xl mb-4">
          "{review.text}"
        </p>

        <p className="text-xl font-bold text-bottom">
          — {review.name}
        </p>
      </div>
    </div>
  ))}
</div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-8 mt-1 mb-12 z-10">
          <a
            href="/stad"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <div className="text-5xl">🏘️</div>
            <span className="bg-white text-black px-2 mt-2 text-sm">
              ↖ STAD
            </span>
          </a>

          <a
            href="https://archive.org"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <div className="text-5xl">💾</div>
            <span className="bg-white text-black px-2 mt-2 text-sm">
              ↖ ARCHIVE
            </span>
          </a>

          <a
            href="https://trishakoevoets.com"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <div className="text-5xl">🌐</div>
            <span className="bg-white text-black px-2 mt-2 text-sm">
              ↖ PORTFOLIO
            </span>
          </a>

          <a
            href="https://trish.hotglue.me"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <div className="text-5xl">📄</div>
            <span className="bg-white text-black px-2 mt-2 text-sm">
              ↖ RESEARCH
            </span>
          </a>
        </div>

        

        <p className="w-full text-m mb-4 leading-[0.9] text-white">
          © - Trisha Koevoets
        </p>
      </div>
    </div>
  );
}