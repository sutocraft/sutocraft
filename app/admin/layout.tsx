export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          background: "#111827",
          color: "#fff",
          padding: 20,
        }}
      >
        <h2>Sutocraft Admin</h2>

        <hr />

        <p>Dashboard</p>
        <p>Categories</p>
        <p>Products</p>
        <p>Orders</p>
      </aside>

      <main
        style={{
          flex: 1,
          padding: 30,
        }}
      >
        {children}
      </main>
    </div>
  );
}