import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Afscheid() {
  const navigate = useNavigate();
  const location = useLocation();

  const [progress, setProgress] = useState(0);

  const oldInternetMessage =
    location.state?.oldInternetMessage || "";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            navigate("/customizen", {
              state: location.state,
            });
          }, 700);

          return 100;
        }

        return prev + 10;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [navigate, location.state]);

  const fireAmount = Math.floor(progress / 10);

  return (

    
    <div className="min-h-screen w-screen bg-black text-orange-500 flex flex-col items-center justify-center p-8 text-center overflow-hidden">

        <img
  src="/doei.gif"
  alt="Afscheid"
  className="
    w-140
    mb-8
  "
/>

      <h1 className="text-6xl font-black mb-8">
        AFSCHEID NEMEN VAN HET OUDE INTERNET
      </h1>

      <p className="text-2xl mb-6 max-w-3xl text-white">
        Je neemt afscheid van:
      </p>

      <div className="border-4 border-orange-500 bg-black p-8 max-w-3xl mb-10 shadow-2xl">
        <p className="text-3xl font-bold">
          “{oldInternetMessage || "niets..."}”
        </p>
      </div>

      <div className="text-5xl mb-4 tracking-widest">
        {"🔥".repeat(fireAmount)}
      </div>

      <div className="w-full max-w-2xl border-4 border-orange-500 h-10 bg-gray-900">
        <div
          className="h-full bg-orange-500 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-6 text-xl text-white">
        {progress}% verbrand...
      </p>

      <div className="text-5xl mt-4 tracking-widest">
        {"🔥".repeat(fireAmount)}
      </div>
    </div>
  );
}