

const GameCircle = ({haveWinner, id, turn, onChangeTurn, clicked }) => {
    const style = {
        borderRadius: "50%",
        height: "80px",
        width: "80px",
        border: "5px solid black",
    };

    return (
        <div
            className={"game-circle " + (clicked[id] === 0 ? "bg-white" : (clicked[id] === 1 ? 'bg-blue' : 'bg-red')) }
            onClick={() => {
                onChangeTurn(id);
            }}
            style={style}
        ></div>
    );
};

export default GameCircle;
