import { useRive } from "@rive-app/react-canvas";
import { useEffect } from "react";

export const RiveAnimation = () => {
  const { rive, RiveComponent } = useRive({
    src: "email2.riv",
    autoplay: true,
  });

  return (
    <RiveComponent
      style={{
        height: 100,
        filter: "drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.1))",
      }}
      onAnimationEnd={() => {
        alert("ended");
        console.log(rive);
        rive && rive?.play();
      }}
      onEnded={() => {
        alert("ended");
        console.log(rive);
        rive && rive?.play();
      }}
      // onMouseEnter={() => rive && rive.play()}
      // onMouseLeave={() => rive && rive.pause()}
    />
  );
};
