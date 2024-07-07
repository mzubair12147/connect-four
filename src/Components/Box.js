export default function Box({ className = "", children }) {
    return <div className={"box " + className}>{children}</div>;
}
