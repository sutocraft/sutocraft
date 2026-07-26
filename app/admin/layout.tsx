import Link from "next/link";

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

        <hr style={{ margin: "15px 0" }} />

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Link
            href="/admin"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/categories"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Categories
          </Link>

          <Link
            href="/admin/products"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Products
          </Link>

          <Link
            href="/admin/orders"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Orders
          </Link>
        </nav>
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