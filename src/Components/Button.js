export default function Button({ onClick = function(){}, children }) {
    return (
        <button onClick={onClick} className="btn">
            {children}
        </button>
    );
}
