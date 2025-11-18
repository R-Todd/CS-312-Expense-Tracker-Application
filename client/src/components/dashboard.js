// client/components/dashboard.js

// =========== IMPORTS ===========
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// ===============================

// Some simple category inputs
const CATEGORY_OPTIONS = [
  "Salary",
  "Rent",
  "Groceries",
  "Gas",
  "Entertainment",
  "Utilities",
  "Other",
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

const Dashboard = () => {
  const navigate = useNavigate();

  // All user-entered data lives here (starts empty)
  const [transactions, setTransactions] = useState([]);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("all");   // "all" or "YYYY-MM"
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Form state for adding a new transaction
  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [formDate, setFormDate] = useState(todayISO);
  const [formType, setFormType] = useState("expense");
  const [formCategory, setFormCategory] = useState("Rent");
  const [formAmount, setFormAmount] = useState("");

  // Build a list of months from the current data (YYYY-MM)
  const monthOptions = Array.from(
    new Set(transactions.map((t) => t.date.slice(0, 7)))
  )
    .sort()
    .reverse();

  // Build list of categories based on what’s actually in the data
  const derivedCategories = Array.from(
    new Set(transactions.map((t) => t.category))
  ).sort();

  // Use actual categories if any exist; otherwise fall back to default list
  const categoryFilterOptions =
    derivedCategories.length > 0 ? derivedCategories : CATEGORY_OPTIONS;

  // Filter transactions by month + category
  const filtered = transactions.filter((t) => {
    const matchesMonth =
      selectedMonth === "all" ? true : t.date.startsWith(selectedMonth);
    const matchesCategory =
      selectedCategory === "all" ? true : t.category === selectedCategory;
    return matchesMonth && matchesCategory;
  });

  // ---- Calculate totals: income, expenses, net, savings % ----
  let incomeTotal = 0;
  let expenseTotal = 0;

  filtered.forEach((t) => {
    if (t.type === "income") {
      incomeTotal += t.amount;
    } else if (t.type === "expense") {
      expenseTotal += t.amount;
    }
  });

  const netIncome = incomeTotal - expenseTotal;
  const savingsRate =
    incomeTotal > 0 ? ((netIncome / incomeTotal) * 100).toFixed(1) : "0.0";

  // ---- Build pie chart data: expenses by category ----
  const categoryMap = new Map();

  filtered.forEach((t) => {
    if (t.type !== "expense") return;
    const prev = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, prev + t.amount);
  });

  const pieDataRaw = Array.from(categoryMap.entries()).map(
    ([name, value]) => ({ name, value })
  );

  const totalExpensesForPie = pieDataRaw.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const pieData = pieDataRaw.map((item) => ({
    ...item,
    percent: totalExpensesForPie
      ? ((item.value / totalExpensesForPie) * 100).toFixed(1)
      : 0,
  }));

  const formatCurrency = (value) =>
    value.toLocaleString(undefined, { style: "currency", currency: "USD" });

  // ---- Handle form submission: add transaction ----
  const handleAddTransaction = (e) => {
    e.preventDefault();

    const amountNumber = parseFloat(formAmount);
    if (!formDate || !formCategory || isNaN(amountNumber) || amountNumber <= 0) {
      alert("Please enter a valid date, category, and positive amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date: formDate,
      type: formType,           // "income" or "expense"
      category: formCategory,
      amount: amountNumber,
    };

    setTransactions((prev) => [...prev, newTransaction]);

    // After adding, clear amount but keep last used date/category/type
    setFormAmount("");
  };

  // ===== JSX RETURN =======
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1.5rem",
        background: "#f5f5f5",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* TOP BAR: title + sign-in / nav (top-right) */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div style={{ textAlign: "right", fontSize: "0.9rem" }}>
          <Link to="/" style={{ marginRight: "0.75rem" }}>
            Home
          </Link>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "0.3rem 0.8rem",
              borderRadius: "999px",
              border: "1px solid #2563eb",
              background: "white",
              color: "#2563eb",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* MONTH FILTER centered above grid */}
      <section
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          <label htmlFor="month-select" style={{ marginRight: "0.5rem" }}>
            Filter by month:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All months</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* MAIN GRID: left = chart, right = summary */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: Pie chart card with category selector below */}
        <div
          style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "0.25rem" }}>
            Expenses by Category
          </h3>
          <p
            style={{
              marginTop: 0,
              fontSize: "0.85rem",
              color: "#555",
              marginBottom: "0.75rem",
            }}
          >
            Showing the percentage of expenses in each category.
          </p>

          {pieData.length === 0 ? (
            <p>No expenses for this selection.</p>
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: "360px",
                height: 220, // smaller height so it’s less zoomed
                margin: "0 auto",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65} // smaller radius to avoid zoomed look
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem"}}
                    formatter={(value, name, props) => {
                        const percent = props?.payload?.percent ?? 0;
                        return [
                            `${formatCurrency(value)} (${percent}%)`,
                            name,
                        ]
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "0.8rem"}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* CATEGORY SELECTOR directly under the pie chart */}
          <div style={{ marginTop: "1rem" }}>
            <label
              htmlFor="category-select"
              style={{ marginRight: "0.5rem", fontSize: "0.85rem" }}
            >
              Filter by category:
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary / dashboard stats */}
        <div
          style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "0.25rem" }}>
            Financial Overview
          </h3>
          <p
            style={{
              marginTop: 0,
              fontSize: "0.85rem",
              color: "#555",
              marginBottom: "0.75rem",
            }}
          >
            Summary based on current month and category filters.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              rowGap: "0.75rem",
              fontSize: "0.95rem",
            }}
          >
            <div>
              <strong>Total Income:</strong>
              <div>{formatCurrency(incomeTotal)}</div>
            </div>
            <div>
              <strong>Total Expenses:</strong>
              <div>{formatCurrency(expenseTotal)}</div>
            </div>
            <div>
              <strong>Net Income:</strong>
              <div>{formatCurrency(netIncome)}</div>
            </div>
            <div>
              <strong>Savings %:</strong>
              <div>{savingsRate}%</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
