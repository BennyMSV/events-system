import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { sessionContext } from "../App";
import { useContext } from "react";
import { useState } from "react";
import "./Timer.css";

export const Timer = ({ onComplete }: { onComplete: () => void }) => {
  const context = useContext(sessionContext);
  const [isPlaying, setIsPlaying] = useState(context?.orderData.quantity !== 0);

  const handleTimeOut = () => {
    console.log("Time Out!");
    onComplete();
    setIsPlaying(false);
    return { shouldRepeat: false, delay: 0 };
  };

  return (
    <div className="timer">
      <div className="timer-wrapper">
        <CountdownCircleTimer
          duration={60}
          colors={["#64BBDD", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[120, 60, 10, 0]}
          onComplete={handleTimeOut}
          isPlaying={isPlaying}
          size={100}
          strokeWidth={4}
        >
          {(remainingTime) => {
            return remainingTime.remainingTime ? (
              <div className="text">
                Tickets <br /> saved for
                <div className="value">
                  {String(remainingTime.remainingTime)}
                </div>
                <div className="text">seconds</div>
              </div>
            ) : (
              <div className="text">
                Tickets <br /> are not <br /> saved <br /> anymore
              </div>
            );
          }}
        </CountdownCircleTimer>
      </div>
    </div>
  );
};
