import { DIFFICULTIES } from "@/constants/nimConstants"

export default function SetupScreen({ 
    error,
    setup,
    setSetup,
    toggleCustomGameOff,
    toggleCustomGameOn,
    customGame,
    buttonPress,
    loading,
    buttonMsg
}) {
return (
    <>
        <div className="setup-card">
            <div className="rules-badge">
            Rules of Nim Game: <br></br>
            Two players. Players take turns removing any number of sticks from a single pile (at least one). The last player to make a move is the winner.
            </div>
        </div>
        <div className="setup-card">
            {error && <div className="error-msg">{error}</div>}

            <div>
            <div className="setup-section-title">Game Mode</div>
            <div className="toggle-group">
                <button
                className={`toggle-btn${!setup.is_pvp ? " active" : ""}`}
                onClick={() => setSetup(s => ({ ...s, is_pvp: false }))}
                >vs Computer</button>
                <button
                className={`toggle-btn${setup.is_pvp ? " active" : ""}`}
                onClick={() => setSetup(s => ({ ...s, is_pvp: true }))}
                >vs Player</button>
            </div>
            </div>

            {!setup.is_pvp && (
            <>
                <div>
                <div className="setup-section-title">Who Goes First</div>
                <div className="toggle-group">
                    <button
                    className={`toggle-btn${setup.player_goes_first ? " active" : ""}`}
                    onClick={() => setSetup(s => ({ ...s, player_goes_first: true }))}
                    >Player First</button>
                    <button
                    className={`toggle-btn${!setup.player_goes_first ? " active" : ""}`}
                    onClick={() => setSetup(s => ({ ...s, player_goes_first: false }))}
                    >Computer First</button>
                </div>
                </div>

                <div>
                <div className="setup-section-title">Difficulty</div>
                <div className="toggle-group">
                    {DIFFICULTIES.map(d => (
                    <button
                        key={d.value}
                        className={`toggle-btn${setup.difficulty === d.value ? " active" : ""}`}
                        onClick={() => setSetup(s => ({ ...s, difficulty: d.value }))}
                    >{d.label}</button>
                    ))}
                </div>
                </div>
            </>
            )}

            <div>
            <div className="setup-section-title">Board Configuration</div>
            <div className="toggle-group">
                <button
                className={`toggle-btn${!customGame ? " active" : ""}`}
                onClick={() => toggleCustomGameOff()}
                >Random Game</button>
                <button
                className={`toggle-btn${customGame ? " active" : ""}`}
                onClick={() => toggleCustomGameOn()}
                >Custom Game</button>

            </div>
            {/* the following line adds extra space to make it look cleaner */}
            <div className="setup-section-title"></div>
            <div className="field-row">
                <div className="field">
                <label>Number of Piles</label>
                <input type="number" value={setup.num_piles}
                    onChange={e => setSetup(s => ({ ...s, num_piles: e.target.value }))} />
                </div>
                {!customGame && (
                <>
                    <div className="field">
                    <label>Min per Pile</label>
                    <input type="number" value={setup.min_per_pile}
                        onChange={e => setSetup(s => ({ ...s, min_per_pile: e.target.value }))} />
                    </div>
                    <div className="field">
                    <label>Max per Pile</label>
                    <input type="number" value={setup.max_per_pile}
                        onChange={e => setSetup(s => ({ ...s, max_per_pile: e.target.value }))} />
                    </div>
                </>
                )}

            </div>
            </div>

            <button className="start-btn" onClick={buttonPress} disabled={loading}>
            {loading ? "Starting..." : buttonMsg}
            </button>
        </div>
    </>
)}