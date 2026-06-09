import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Afscheid() {
  const navigate = useNavigate();
  const location = useLocation();

  const [progress, setProgress] = useState(0);

  const oldInternetMessage = location.state?.oldInternetMessage || "";
  const survivalObject = location.state?.survivalObject || "";
  const oldOnlinePlace = location.state?.oldOnlinePlace || "";
  const takeFromInternet = location.state?.takeFromInternet || "";
  const [started, setStarted] = useState(false);

  const clouds = [
    { src: "/clouds/Clouds1.png", className: "top-[5%] left-[6%] opacity-25 blur-lg" },
    { src: "/clouds/Clouds2.png", className: "top-[12%] right-[12%] opacity-30 blur-md" },
    { src: "/clouds/Clouds3.png", className: "top-[24%] left-[22%] opacity-20 blur-xl" },
    { src: "/clouds/Clouds4.png", className: "top-[35%] right-[8%] opacity-35 blur-md" },
    { src: "/clouds/Clouds5.png", className: "top-[48%] left-[8%] opacity-30 blur-sm" },
  ];

useEffect(() => {
  if (!started) return;

  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          navigate("/customizen", {
            state: location.state,
          });
        }, 900);

        return 100;
      }

      return prev + 10;
    });
  }, 700);

  return () => clearInterval(interval);
}, [started, navigate, location.state]);

  const goodbyeSteps = [
    "Je digitale spullen worden zachtjes opgetild...",
    "Je laat los wat niet meer van jou voelde...",
    "Je neemt mee wat waarde heeft...",
    "Je data hoeft hier niet meer verkocht te worden...",
    "Er ontstaat ruimte voor een nieuwe plek...",
    "Bijna thuis...",
  ];

  const currentStep =
    goodbyeSteps[Math.min(Math.floor(progress / 20), goodbyeSteps.length - 1)];

  return (
    <div
      className="
        min-h-screen
        w-screen
        text-blue-900
        flex
        flex-col
        items-center
        justify-center
        p-8
        text-center
        overflow-hidden
        relative
      "
      style={{
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.95) 0%, rgba(199, 228, 255, 0.75) 18%, rgba(210, 210, 210, 0.45) 38%, rgba(228, 228, 228, 1) 78%, rgba(255, 255, 255, 1) 100%)",
      }}
    >
      {/* HEMELSE GLOW ACHTERGROND */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.75), transparent 28%), radial-gradient(circle at 20% 70%, rgba(249, 248, 248, 0.71), transparent 20%), radial-gradient(circle at 80% 65%, rgba(244, 244, 244, 0.28), transparent 22%)",
        }}
      />

      {/* LICHTSTRALEN */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] opacity-60 pointer-events-none"
        style={{
          background:
            "conic-gradient(from 180deg, transparent, rgba(255,255,255,0.22), transparent, rgba(255,255,255,0.12), transparent)",
          filter: "blur(18px)",
        }}
      />

      {/* WOLKEN */}
      {clouds.map((cloud, index) => (
        <img
          key={index}
          src={cloud.src}
          alt=""
          className={`
            absolute
            w-[160px]
            pointer-events-none
            ${cloud.className}
          `}
        />
      ))}

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-6xl mb-6 leading-[0.9] text-white drop-shadow-[0_0_25px_rgba(0,120,255,1)]">
          Tijd om afscheid te nemen van het internet van nu...
        </h1>

        <p className="text-2xl mb-10 max-w-3xl text-white drop-shadow-[0_0_10px_rgba(0,120,255,1)]">
          Je verlaat niet alles. Je laat vooral achter wat zwaar voelde:
          platforms die je aandacht vasthouden, je data verzamelen en je online
          leven verkopen. Wat van jou is, mag mee.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mb-10">
          <div className="bg-white/75 backdrop-blur-md border-2 border-white shadow-[0_0_45px_rgba(255,255,255,0.65)] text-white">
            <div className="bg-white/70 border-b-2 border-white px-3 py-2 text-left shadow-[0_0_25px_rgba(255,255,255,0.7)]">
              <p className="font-bold text-sm text-blue-900">
                WAT JE ACHTERLAAT
              </p>
            </div>

            <div className="p-5 text-left">
              <p className="text-sm mb-2 opacity-70 text-blue-900">
                Een oude plek, gewoonte of herinnering:
              </p>

              <p className="text-2xl leading-tight text-black">
                “{oldInternetMessage || "iets dat niet meer bij je past"}”
              </p>

              <p className="text-sm mt-5 opacity-70 text-blue-900">
                Oude online plek:
              </p>

              <p className="text-xl text-black">
                {oldOnlinePlace || "een platform dat je mag loslaten"}
              </p>
            </div>
          </div>

          <div className="bg-white/75 backdrop-blur-md border-2 border-white shadow-[0_0_45px_rgba(255,255,255,0.65)] text-blue-950">
            <div className="bg-white/70 border-b-2 border-white px-3 py-2 text-left shadow-[0_0_25px_rgba(255,255,255,0.7)]">
              <p className="font-bold text-sm text-blue-900">
                WAT JE MEENEEMT
              </p>
            </div>

            <div className="p-5 text-left">
              <p className="text-sm mb-2 opacity-70">
                Je digitale overlevingsobject:
              </p>

              <p className="text-2xl leading-tight">
                {survivalObject || "iets kleins dat van jou blijft"}
              </p>

              <p className="text-sm mt-5 opacity-70">
                Wat je wél wilt bewaren:
              </p>

              <p className="text-xl">
                {takeFromInternet || "je herinneringen, je stijl, je eigen plek"}
              </p>
            </div>
          </div>
        </div>

        {!started && (
  <button
    onClick={() => setStarted(true)}
    className="
      mt-6
      mb-10
      px-10
      py-4
      bg-white/70
      backdrop-blur-md
      border-2
      border-white
      text-blue-900
      text-xl
      hover:scale-105
      transition-all
      shadow-[0_0_25px_rgba(255,255,255,0.8)]
      cursor-pointer
    "
  >
    Ik ben klaar om verder te gaan →
  </button>
)}

        {started && (
  <div className="w-full max-w-2xl border-2 border-white h-10 bg-white/20 backdrop-blur-md mb-6 shadow-[0_0_35px_rgba(255,255,255,0.75)]">
    <div
      className="h-full bg-white transition-all duration-500 shadow-[0_0_25px_rgba(255,255,255,1)]"
      style={{
        width: `${progress}%`,
      }}
    />
  </div>
)}

        {started && (
  <>
    <p className="text-2xl mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
      {currentStep}
    </p>

    <p className="text-xl text-blue-600/90">
      {progress}% klaar voor een nieuwe start
    </p>
  </>
)}

        <div className="mt-10 text-5xl tracking-widest text-blue-900 drop-shadow-[0_0_18px_rgba(255,255,255,1)]">
          {"✦".repeat(Math.max(1, Math.floor(progress / 20)))}
        </div>
      </div>
    </div>
  );
}