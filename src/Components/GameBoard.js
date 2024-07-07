import { useEffect, useState } from "react";
import GameCircle from "./GameCircle";
import Box from "./Box";
import Button from "./Button";

const winCondition = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
];

function pattern(indexes, max, steps) {
    return { indexes, max, steps };
}

export default function GameBoard() {
    const [clicked, setClicked] = useState(Array.from([]));
    const [turn, setTurn] = useState(0);
    const [haveWinner, setHaveWinner] = useState(0);

    function handleInitializeBoard() {
        setTurn(0);
        setClicked(Array.from({ length: 16 }, (v, i) => 0));
        setHaveWinner(0);
    }

    useEffect(() => {
        handleInitializeBoard();
    }, []);

    function handleIsDraw(id ) {
        let board = [...clicked];
        board[id] = 1;
        let count = board.reduce((prev, curr) => prev + (curr === 0), 0);
        return count === 0;
    }

    function handleCheckWinner(id) {
        const tempClicked = [...clicked];
        tempClicked[id] = turn === 0 ? 1 : 2;

        for (let i = 0; i < winCondition.length; i++) {
            const [zero, one, two, three] = winCondition[i];
            if (
                tempClicked[zero] > 0 &&
                tempClicked[zero] === tempClicked[one] &&
                tempClicked[one] === tempClicked[two] &&
                tempClicked[two] === tempClicked[three]
            ) {
                return tempClicked[zero];
            }
        }
        return 0;
    }

    function handleChangeTurn(id) {
        if ((clicked[id] > 0) | (haveWinner > 0)) return;

        setClicked((clicked) =>
            clicked.map((value, index) =>
                index === id ? (turn === 0 ? 1 : 2) : value
            )
        );
        if (handleIsDraw(id)) {
            setHaveWinner(-1);
            return;
        }
        const winner = handleCheckWinner(id);
        if (winner) setHaveWinner(winner);

        setTurn((turn) => (turn === 0 ? 1 : 0));
    }

    function getPosition(moveCheck) {
        for (let check = 0; check < moveCheck.length; check++) {
            for (let i = 0; i < moveCheck[check].max; i += moveCheck[check].step) {
                let series =
                    clicked[i + moveCheck[check].indexes[0]].toString() +
                    clicked[i + moveCheck[check].indexes[1]].toString() +
                    clicked[i + moveCheck[check].indexes[2]].toString() +
                    clicked[i + moveCheck[check].indexes[3]].toString();
                switch (series) {
                    case "1110":
                    case "2220":
                        return i + moveCheck[check].indexes[3];
                    case "1101":
                    case "2202":
                        return i + moveCheck[check].indexes[2];
                    case "1011":
                    case "2022":
                        return i + moveCheck[check].indexes[1];

                    case "0111":
                    case "0222":
                        return i + moveCheck[check].indexes[0];

                    default:
                }
            }
        }

        return -1;
    }

    function handleComputerMove() {
        const moveCheck = [
            pattern([0, 4, 8, 12], 4, 1),
            pattern([0, 1, 2, 3], 16, 4),
            pattern([0, 5, 10, 15], 16, 16),
            pattern([3, 6, 9, 12], 16, 16),
        ];
        const position = getPosition(moveCheck);
        console.log(position)
        return position;
    }

    function randomComputerMove() {
        const validSteps = [];
        for (let i = 0; i < clicked.length; i++) {
            if (clicked[i] === 0) {
                validSteps.push(i);
            }
        }

        const step = Number.parseInt(Math.random() * validSteps.length);
        return validSteps[step];
    }

    function handleSuggestion() {
        const move = handleComputerMove();

        if (move > -1) handleChangeTurn(move);
        else handleComputerMove(randomComputerMove());
    }

    function renderTurnText() {
        if (haveWinner > 0) {
            return `Player ${haveWinner} wins`;
        } else if (haveWinner < 0) {
            return `Game is a Draw`;
        } else {
            return `Player ${turn + 1} Turn`;
        }
    }

    return (
        <div
            className="game-board"
            style={{
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gridTemplateRows: "repeat(4,1fr)",
                height: "fit-content",
                gap: "10px",
                width: "fit-content",
                padding: "20px",
                borderRadius: "50px",
                border: "5px solid #ffab73",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
            }}
        >
            <Box className="box-up">{renderTurnText()}</Box>
            {Array.from({ length: 16 }, (value, index) => (
                <GameCircle
                    key={index}
                    id={index}
                    turn={turn}
                    onChangeTurn={handleChangeTurn}
                    haveWinner={haveWinner}
                    clicked={clicked}
                />
            ))}

            <Box className="box-down">
            {
                (haveWinner > 0 || handleIsDraw(clicked.indexOf(1) | clicked.indexOf(2)) ) && 
                <Button onClick={handleInitializeBoard}>New Game</Button>
            }
            
                <Button onClick={handleSuggestion}>Suggest</Button>
            </Box>
        </div>
    );
}
