import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

export default function Customizen({ name }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [houseColor, setHouseColor] = useState("#fef3c7");
  const [pageStyle, setPageStyle] = useState("hyves");
  const [profilePicture, setProfilePicture] = useState("/plaatje1.png");

  const oldInternetMessage = location.state?.oldInternetMessage || "";
  const takeFromInternet = location.state?.takeFromInternet || "";
  const favoriteInternetMedia = location.state?.favoriteInternetMedia || "";
  const survivalObject = location.state?.survivalObject || "";
  const oldOnlinePlace = location.state?.oldOnlinePlace || "";
  const roomType = location.state?.roomType || "browser_window";

  async function saveHouse() {
    const { data, error } = await supabase
      .from("houses")
      .insert([
        {
          name: name || "Anoniem",
          old_internet_message: oldInternetMessage,
          take_from_internet: takeFromInternet,
          favorite_internet_media: favoriteInternetMedia,
          survival_object: survivalObject,
          old_online_place: oldOnlinePlace,
          room_type: roomType,
          house_color: houseColor,
          house_style: pageStyle,
          profile_picture: profilePicture,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      alert("Er ging iets fout met opslaan");
      return;
    }

    navigate(`/huisje/${data[0].id}`);
  }

  return (
    <div
      className="min-h-screen min-w-screen bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/Frontpage.png')",
      }}
    >
      {/* SCROLLENDE BALK */}
      <div className="absolute top-0 left-0 w-full h-14 bg-black border-b-2 border-black overflow-hidden z-50 flex items-center">
        <div
          className="whitespace-nowrap text-white font-bold text-xl"
          style={{
            animation: "marquee 20s linear infinite",
          }}
        >
          ✦ CUSTOMIZE JE INTERNETPLEK ✦ {"\u00A0".repeat(30)}
          ✦ KIES JE KLEUR ✦ {"\u00A0".repeat(30)}
          ✦ MAAK JE DIGITALE HUIS EIGEN ✦ {"\u00A0".repeat(30)}
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <h1 className="max-w-240 text-[60px] md:text-[90px] mb-10 leading-[0.85] text-white text-center z-10">
          Maak je internetplek eigen.
        </h1>

        <div className="grid md:grid-cols-[1fr_320px] gap-8 w-full max-w-6xl z-10">
          {/* CUSTOMIZE WINDOW */}
          <div className="bg-gray-300 border-2 border-black shadow-2xl">
            <div className="bg-blue-700 border-b-2 border-black px-2 py-1 flex justify-between items-center">
              <p className="font-bold text-sm text-white">
                CUSTOMIZE.EXE
              </p>

              <span className="bg-gray-200 border border-black px-2 text-black font-bold">
                ×
              </span>
            </div>

            <div className="p-8 flex flex-col gap-8 text-black">
              {/* KLEUREN */}
              <section>
                <h2 className="text-3xl font-bold mb-2">
                  1. Kies je kleur
                </h2>

                <p className="mb-5 text-xl">
                  Klik op een kleurvakje. Je ziet rechts meteen hoe je plek eruitziet.
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {[
                    "#fef3c7",
                    "#fca5a5",
                    "#fdba74",
                    "#fde047",
                    "#86efac",
                    "#93c5fd",
                    "#c4b5fd",
                    "#f0abfc",
                    "#ffffff",
                    "#a7f3d0",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setHouseColor(color)}
                      className={`
                        h-20 border-2 cursor-pointer transition-transform
                        hover:scale-110 active:scale-95
                        ${
                          houseColor === color
                            ? "border-black scale-105 shadow-2xl"
                            : "border-gray-600"
                        }
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="mt-6 bg-white border-2 border-black p-4 flex items-center justify-between gap-4">
                  <span className="font-bold text-xl">Of kies zelf:</span>

                  <input
                    type="color"
                    value={houseColor}
                    onChange={(e) => setHouseColor(e.target.value)}
                    className="w-24 h-12 cursor-pointer border-2 border-black"
                  />
                </div>
              </section>

              {/* STIJL */}
              <section>
                <h2 className="text-3xl font-bold mb-2">
                  2. Kies je oude internetstijl
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  {[
                    { value: "hyves", label: "Hyves stijl", icon: "💙" },
                    { value: "geocities", label: "GeoCities stijl", icon: "✨" },
                    { value: "msn", label: "MSN stijl", icon: "💬" },
                    { value: "forum", label: "Oud forum stijl", icon: "🧱" },
                  ].map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setPageStyle(style.value)}
                      className={`
                        border-2 p-4 text-left text-xl font-bold cursor-pointer transition-transform
                        hover:scale-105 active:scale-95
                        ${
                          pageStyle === style.value
                            ? "bg-blue-700 text-white border-black shadow-2xl"
                            : "bg-white text-black border-black"
                        }
                      `}
                    >
                      <span className="text-3xl mr-2">{style.icon}</span>
                      {style.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* PROFIELFOTO */}
              <section>
                <h2 className="text-3xl font-bold mb-2">
                  3. Kies je profielfoto
                </h2>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-5">
                  {[
                    "/plaatje1.png",
                    "/plaatje2.png",
                    "/plaatje3.png",
                    "/plaatje4.png",
                    "/plaatje5.png",
                    "/plaatje6.png",
                  ].map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setProfilePicture(img)}
                      className={`
                        bg-white border-2 p-1 cursor-pointer transition-transform
                        hover:scale-110 active:scale-95
                        ${
                          profilePicture === img
                            ? "border-blue-700 scale-105 shadow-2xl"
                            : "border-black"
                        }
                      `}
                    >
                      <img
                        src={img}
                        alt="avatar"
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* PREVIEW WINDOW */}
          <aside className="bg-gray-300 border-2 border-black shadow-2xl h-fit sticky top-20">
            <div className="bg-blue-700 border-b-2 border-black px-2 py-1 flex justify-between items-center">
              <p className="font-bold text-sm text-white">
                PREVIEW.HTML
              </p>

              <span className="bg-gray-200 border border-black px-2 text-black font-bold">
                ×
              </span>
            </div>

            <div className="p-5 text-black">
              <div
                className="border-2 border-black p-5 min-h-80 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: houseColor }}
              >
                <img
                  src={profilePicture}
                  alt="preview avatar"
                  className="w-28 h-28 object-cover border-2 border-black bg-white mb-5"
                />

                <p className="text-2xl font-bold">
                  {name || "Anoniem"}'s internetplek
                </p>

                <p className="mt-3 bg-white border border-black px-2 py-1 text-sm">
                  stijl: {pageStyle}
                </p>
              </div>

              <button
                onClick={saveHouse}
                className="mt-6 bg-blue-700 text-white px-8 py-4 w-full border-black border-2 cursor-pointer hover:scale-105 transition-transform text-xl font-bold"
              >
                Maak mijn internetplek
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}