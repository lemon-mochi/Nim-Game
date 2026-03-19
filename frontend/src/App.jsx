import "./styles/globals.scss"
import "./styles/nim.scss";
import { useNimGame } from "@/hooks/useNimGame";
import SetupScreen from "@/components/SetupScreen/SetupScreen";
import CustomizationScreen from "@/components/CustomizationScreen/CustomizationScreen";
import GameScreen from "@/components/GameScreen/GameScreen";

export default function NimGame() {

  const game = useNimGame();

  return (
    <div className="nim-root">
      <div className="title">N<span>I</span>M</div>
      <div className="subtitle">The Ancient Game of Strategy</div>

      {game.screen === "setup" && (
        <SetupScreen {...game}/>
      )}


      {game.screen === "customize" && (
        <CustomizationScreen {...game}/>
      )}

      {game.screen === "game" && game.state && (
        <GameScreen {...game}/>
      )}
    </div>
  )
}
