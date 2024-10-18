import { Noise } from "~/components/shared/Noise";
import { MeshGradientRenderer } from "@johnn-e/react-mesh-gradient";
import { useEffect, useState } from "react";

export const Background = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsPlaying(true);
    }, 400);
  }, []);

  const bgColor = "#ffffff";

  return (
    <div className={`absolute top-0 -z-10 h-full w-full transition-opacity duration-1000`} style={{ opacity: isPlaying ? 1 : 0, transitionDuration: "1500ms" }}>
      <MeshGradientRenderer
        colors={[bgColor, "#ff00c9", bgColor, "#7022ff", bgColor]}
        speed={0.008}
        className={`absolute h-full w-full z-0 `}
        wireframe={false}
        backgroundColor={"#FFFFFF"}
      />

      <Noise />
      {/* <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.9)] opacity-50 blur-[80px]"></div> */}
    </div>
  );
};
