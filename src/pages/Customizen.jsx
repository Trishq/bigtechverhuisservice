import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";


export default function Customizen({ name, links }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [houseColor, setHouseColor] = useState("#fef3c7");
  const [pageStyle, setPageStyle] = useState("hyves");

  const oldInternetMessage = location.state?.oldInternetMessage || "";
  const takeFromInternet = location.state?.takeFromInternet || "";
  const favoriteInternetMedia =
    location.state?.favoriteInternetMedia || "";
  const survivalObject = location.state?.survivalObject || "";
  const oldOnlinePlace = location.state?.oldOnlinePlace || "";
  const roomType = location.state?.roomType || "browser_window";

  const [profilePicture, setProfilePicture] =
  useState("/plaatje1.png");

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
      className="min-h-screen w-screen flex items-center justify-center px-6"
      style={{
        backgroundColor: "#3700ff",
      }}
    >
      <div className="w-full max-w-2xl flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-12 text-white leading-none mt-20">
          MAAK JE <br />
          INTERNETPLEK EIGEN
        </h1>

        <div className="w-full border-4 border-gray-700 text-black bg-gray-300 p-10 flex flex-col gap-8 items-center mb-30">
          <label className="flex flex-col items-center text-2xl font-bold gap-4">
            Kies de achtergrondkleur van je plek

            <input
              type="color"
              value={houseColor}
              onChange={(e) => setHouseColor(e.target.value)}
              className="w-32 h-14 cursor-pointer"
            />
          </label>

          <label className="flex flex-col items-center text-2xl font-bold gap-4 w-full">
            Kies de stijl van je pagina

            <select
              value={pageStyle}
              onChange={(e) => setPageStyle(e.target.value)}
              className="p-4 border-2 border-black w-full max-w-md text-center text-xl"
            >
              <option value="hyves">Hyves stijl</option>
              <option value="geocities">GeoCities stijl</option>
              <option value="msn">MSN stijl</option>
              <option value="forum">Oud forum stijl</option>
            </select>
          </label>

          <label className="
  flex
  flex-col
  items-center
  text-2xl
  font-bold
  gap-4
  w-full
">

  Kies je profielfoto

  <div className="
    grid
    grid-cols-3
    gap-4
  ">

    {[
      "/plaatje1.png",
      "/plaatje2.png",
      "/plaatje3.png",
      "/plaatje4.png",
      "/plaatje5.png",
      "/plaatje6.png",
    ].map((img) => (

      <img
        key={img}
        src={img}
        alt="avatar"
        onClick={() =>
          setProfilePicture(img)
        }
        className={`
          w-24
          h-24
          object-cover
          border-4
          cursor-pointer
          hover:scale-105
          transition-transform

          ${
            profilePicture === img
              ? "border-blue-600"
              : "border-transparent"
          }
        `}
      />

    ))}

  </div>

</label>

          <button
            onClick={saveHouse}
            className="bg-blue-600 text-white px-7 py-3 border-2 border-gray-700 text-2xl hover:bg-gray-700 hover:scale-105 transition-transform cursor-pointer"
          >
            Maak mijn internetplek
          </button>
        </div>
      </div>
    </div>
  );
}