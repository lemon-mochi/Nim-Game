import PileCard from "@/components/PileCard/PileCard";
import { maxCustomAmount } from "@/constants/nimConstants";

export default function CustomizationScreen({
    resetToSetup,
    customPiles,
    selectedPile,
    setSelectedPile,
    amount,
    setAmount,
    applyAmount,
    loading,
    startCustomGame
}) {
    return (
          <div className="game-area">
            <div className="status-bar">
              Custom Game Configuration
              <button className="reset-btn" onClick={resetToSetup}>↩ Return</button>
            </div>
            <div className="piles-container">
              {customPiles?.map((count, idx) => (
                <PileCard
                  key={idx}
                  idx={idx}
                  count={count}
                  selected={selectedPile === idx}
                  onSelect={(i) => {
                    setSelectedPile(i);
                    setAmount(1);
                  }}
                />
              ))}
            </div>

            {selectedPile !== null && (
              <div className="move-panel">
                <div className="move-panel-title">
                  Set amount for pile {selectedPile + 1}
                </div>
                <div className="move-row">
                  <span className="move-label">Amount:</span>
                  <div className="move-amount-controls">
                    <button className="amt-btn"
                      disabled={amount <= 1}
                      onClick={() => setAmount(a => Math.max(1, a - 1))}>−</button>
                    <div className="amt-display">{amount}</div>
                    <button className="amt-btn"
                      disabled={amount >= maxCustomAmount}
                      onClick={() => setAmount(a => Math.min(maxCustomAmount, a + 1))}>+</button>
                  </div>
                  <span style={ { fontSize: 11, color: "var(--global-muted)" } }>
                    max: {maxCustomAmount}
                  </span>
                  <button
                    className="confirm-btn"
                    onClick={applyAmount}
                    disabled={loading || amount < 1 || amount > maxCustomAmount}
                  >
                    Apply
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => setSelectedPile(null)}
                    disabled={loading || amount < 1 || amount > maxCustomAmount}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {selectedPile === null &&(
              <button className="start-btn" onClick={startCustomGame} disabled={loading}>
                {loading ? "Starting..." : "Start Game"}
              </button>
            )}


          </div>
    )}
