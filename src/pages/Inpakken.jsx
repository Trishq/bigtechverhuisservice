import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Inpakken({ name }) {
  const navigate = useNavigate();

  const [oldInternetMessage, setOldInternetMessage] = useState("");
  const [takeFromInternet, setTakeFromInternet] = useState("");
  const [favoriteInternetMedia, setFavoriteInternetMedia] = useState("https://");
  const [survivalObject, setSurvivalObject] = useState("💿 Oude mp3");
  const [oldOnlinePlace, setOldOnlinePlace] = useState("Hyves");
  const [roomType, setRoomType] = useState("browser_window");

  return (
    <div
      className="min-h-screen w-screen"
      style={{ backgroundColor: "#edededff" }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-7xl font-black mb-6 text-blue-600">
          PAK JE INTERNETLEVEN IN 📦
        </h1>

        <p className="text-3xl text-blue-600 mb-10 max-w-4xl">
          Kies wat je meeneemt, waar je vandaan komt
          en wat je achterlaat.
        </p>

        <div className="grid gap-7 max-w-2xl w-full text-left">
          <div className="text-blue-600 p-1">
            <p className="text-3xl font-bold mb-5">
              Wat laat je achter op het huidige internet?
            </p>

            <textarea
              value={oldInternetMessage}
              onChange={(e) => setOldInternetMessage(e.target.value)}
              placeholder="Bijvoorbeeld: ik laat eindeloos scrollen achter..."
              className="bg-white w-full p-4 border-2 border-radius-20 border-blue-600 min-h-32"
            />
          </div>

          <div className="text-blue-600 p-1">
            <p className="text-3xl font-bold mb-5">
              Wat neem je mee van het huidige internet naar het nieuwe?
            </p>

            <textarea
              value={takeFromInternet}
              onChange={(e) => setTakeFromInternet(e.target.value)}
              placeholder="Bijvoorbeeld: mijn favoriete memes, online vriendschappen of playlists..."
              className="bg-white w-full p-4 border-2 border-radius-20 border-blue-600 min-h-32"
            />
          </div>

          <div className="text-blue-600 p-1">

  <p className="
    text-3xl
    font-bold
    mb-5
  ">
    Welk internet media (zoals een video, playlist, website, forum, etc.) neem je mee?
  </p>

  <input
    type="text"
    value={favoriteInternetMedia}
    onChange={(e) =>
      setFavoriteInternetMedia(e.target.value)
    }
    placeholder="
      Bijvoorbeeld:
      https://youtube.com/watch?v=...
    "
    className="
      bg-white
      w-full
      p-4
      border-2
      border-blue-600
    "
  />

</div>

          <div className="text-blue-600 p-1">
            <p className="text-3xl font-bold mb-4">
              Welk internet object neem jij mee?
            </p>

            <select
              value={survivalObject}
              onChange={(e) => setSurvivalObject(e.target.value)}
              className="w-full h-10 p-1 border-2 border-blue-500 bg-white text-1xl text-blue-500"
            >
              <option>💿 Oude .mp3 bestanden</option>
              <option>📁 Downloads map</option>
              <option>💬 Ongelezen DMs</option>
              <option>⭐ Favorietenlijst</option>
              <option>📺 Iconische YouTube video's</option>
              <option>🧷 Opgeslagen memes</option>
            </select>
          </div>

          <div className="text-blue-600 p-1">
            <p className="text-3xl font-bold mb-4">
              Waar woonde jij vroeger op het internet?
            </p>

            <select
              value={oldOnlinePlace}
              onChange={(e) => setOldOnlinePlace(e.target.value)}
              className="w-full h-10 p-1 border-2 border-blue-500 bg-white text-1xl text-blue-500"
            >
              <option>Hyves</option>
              <option>MSN</option>
              <option>Discord</option>
              <option>Reddit</option>
              <option>Minecraft server</option>
              <option>Niche forum</option>
              <option>Habbo hotel</option>
            </select>
          </div>

          <div className="text-blue-600 p-1">
            <p className="text-3xl font-bold mb-4 ">
              Hoe wil je wonen in het nieuwe internet?
            </p>

            <div className="bg-white p-5 border-2 border-blue-500">
              <label className="block mb-3">
                <input
                  type="radio"
                  name="roomType"
                  value="browser_window"
                  checked={roomType === "browser_window"}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="mr-3"
                />
                Internet explorer — ik klik, dwaal en ontdek alle hoeken van het internet 🗺️
              </label>

              <label className="block mb-3">
                <input
                  type="radio"
                  name="roomType"
                  value="chatroom"
                  checked={roomType === "chatroom"}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="mr-3"
                />
                Chatroom chatter — ik praat, reageer en ontmoet mensen van over het hele internet 💬
              </label>

              <label className="block">
                <input
                  type="radio"
                  name="roomType"
                  value="archive"
                  checked={roomType === "archive"}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="mr-3"
                />
                Archief verzamelaar — ik verzamel en bewaar internetdingen 🗃️
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            navigate("/afscheid", {
              state: {
                oldInternetMessage,
                takeFromInternet,
                favoriteInternetMedia,
                survivalObject,
                oldOnlinePlace,
                roomType,
              },
            })
          }
          className="mt-10 bg-blue-500 text-white px-8 py-4 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
        >
          Verder naar customizen
        </button>
      </div>
    </div>
  );
}