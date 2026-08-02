import PileCard from "@/components/PileCard/PileCard";

export default function GameScreen({
    state,
    thinking,
    turnMsg,
    resetToSetup,
    error,
    selectedPile,
    setSelectedPile,
    isPlayerTurn,
    amount,
    setAmount,
    maxAmount,
    makeMove,
    loading,
    winMessage,
    wythoff
}) {
    const getMoveName = () => {
        if (!wythoff) {
            return `Remove from Pile ${selectedPile + 1}`;
        }

        if (selectedPile === 0) {
            return "Remove from First Pile";
        }

        if (selectedPile === 1) {
            return "Remove from Second Pile";
        }

        return "Remove from Both Piles";
    };


    return (
        <div className="game-area">

            <div className="status-bar">
                <div className="status-indicator">
                    <div className={`status-dot${state.game_over ? " idle" : thinking ? " enemy" : ""}`} />
                    <span style={{ fontSize: 12 }}>
                        {state.game_over ? "Game Over" : thinking ? (
                            <span className="thinking">
                                Computer thinking
                                <span className="thinking-dots">
                                    <span>.</span><span>.</span><span>.</span>
                                </span>
                            </span>
                        ) : turnMsg}
                    </span>
                </div>

                <button className="reset-btn" onClick={resetToSetup}>
                    ↩ New Game
                </button>
            </div>


            {error && <div className="error-msg">{error}</div>}


            {!state.game_over ? (
                <>
                    <div className="piles-container">

                        {state.piles?.map((count, idx) => (
                            <PileCard
                                key={idx}
                                idx={idx}
                                count={count}
                                selected={selectedPile === idx}
                                onSelect={(i) => {
                                    if (!isPlayerTurn) return;

                                    setSelectedPile(i);
                                    setAmount(1);
                                }}
                                disabled={!isPlayerTurn}
                            />
                        ))}


                        {wythoff && (
                            <button
                                className={`bothPilesBtn${selectedPile === 2 ? " active" : ""}`}
                                onClick={() => {
                                    if (!isPlayerTurn) return;

                                    setSelectedPile(2);
                                    setAmount(1);
                                }}
                                disabled={!isPlayerTurn}
                            >
                                ⇅ Both Piles
                            </button>
                        )}

                    </div>


                    {selectedPile !== null && isPlayerTurn && (
                        <div className="move-panel">

                            <div className="move-panel-title">
                                {getMoveName()}
                            </div>


                            <div className="move-row">

                                <span className="move-label">
                                    Amount:
                                </span>


                                <div className="move-amount-controls">

                                    <button
                                        className="amt-btn"
                                        disabled={amount <= 1}
                                        onClick={() =>
                                            setAmount(a => Math.max(1, a - 1))
                                        }
                                    >
                                        −
                                    </button>


                                    <div className="amt-display">
                                        {amount}
                                    </div>


                                    <button
                                        className="amt-btn"
                                        disabled={amount >= maxAmount}
                                        onClick={() =>
                                            setAmount(a => Math.min(maxAmount, a + 1))
                                        }
                                    >
                                        +
                                    </button>

                                </div>


                                <span style={{
                                    fontSize: 11,
                                    color: "var(--global-muted)"
                                }}>
                                    max: {maxAmount}
                                </span>


                                <button
                                    className="confirm-btn"
                                    onClick={makeMove}
                                    disabled={
                                        loading ||
                                        amount < 1 ||
                                        amount > maxAmount
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        </div>
                    )}

                </>
            ) : (

                <>
                    <div className="piles-container">

                        {state.piles?.map((count, idx) => (
                            <PileCard
                                key={idx}
                                idx={idx}
                                count={count}
                                selected={false}
                                disabled={true}
                            />
                        ))}

                    </div>


                    <div className="gameover-overlay">
                        <div className="gameover-title win">
                            {winMessage()}
                        </div>

                        <div className="gameover-subtitle">
                            All sticks have been taken
                        </div>

                        <button
                            className="play-again-btn"
                            onClick={resetToSetup}
                        >
                            Play Again
                        </button>
                    </div>

                </>
            )}

        </div>
    );
}