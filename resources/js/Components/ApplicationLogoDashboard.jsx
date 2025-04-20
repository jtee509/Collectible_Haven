export default function ApplicationLogoDashboard(props) {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <img
                {...props}
                src="/images/logo.png"
                alt="Application Logo"
                style={{ marginRight: "8px" }}
            />
            <div>Dashboard</div>
        </div>
    );
}
