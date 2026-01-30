import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const API = "http://localhost:5000/leads";

/* DATE FORMAT → DD-MON-YYYY */
const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const m = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${String(date.getDate()).padStart(2,"0")}-${m[date.getMonth()]}-${date.getFullYear()}`;
};

export default function App() {
  const [leads, setLeads] = useState([]);
  const [activePage, setActivePage] = useState("overview");
  const [modal, setModal] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    status: "New",
    notes: "",
    followUp: "",
  });

  /* ================= FETCH ================= */
  const fetchLeads = async () => {
    const res = await axios.get(API);
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= ADD ================= */
  const addLead = async () => {
    if (!form.name || !form.email) return;

    await axios.post(API, form);
    setForm({
      name: "",
      email: "",
      status: "New",
      notes: "",
      followUp: "",
    });
    fetchLeads();
  };

  /* ================= UPDATE ================= */
  const saveUpdate = async () => {
    await axios.put(`${API}/${modal._id}`, {
      status: modal.status,
      notes: modal.notes,
      followUp: modal.followUp,
    });
    setModal(null);
    fetchLeads();
  };

  /* ================= DELETE ================= */
  const deleteLead = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchLeads();
  };

  /* ================= STATS ================= */
  const total = leads.length;
  const newCount = leads.filter(l => l.status === "New").length;
  const contacted = leads.filter(l => l.status === "Contacted").length;
  const converted = leads.filter(l => l.status === "Converted").length;

  const percent = (v) => total ? Math.round((v / total) * 100) : 0;

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>MINI CRM</h2>
        <p className="sub">Customer Relationship Management</p>
        <nav>
          <div
            className={activePage === "overview" ? "active" : ""}
            onClick={() => setActivePage("overview")}
          >
            Overview
          </div>
          <div
            className={activePage === "leads" ? "active" : ""}
            onClick={() => setActivePage("leads")}
          >
            Leads
          </div>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="content">

        {/* ================= OVERVIEW ================= */}
        {activePage === "overview" && (
          <>
            <h2>Add Lead</h2>
            <div className="form-section">
              <input placeholder="Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
              <select value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>New</option>
                <option>Contacted</option>
                <option>Converted</option>
              </select>
              <textarea placeholder="Notes" value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} />
              <input type="date" value={form.followUp}
                onChange={e => setForm({ ...form, followUp: e.target.value })} />
              <button onClick={addLead}>Add Lead</button>
            </div>

            <h2>Lead List</h2>
            <table className="lead-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Follow-ups</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(l => (
                  <tr key={l._id}>
                    <td>{l.name}</td>
                    <td>{l.email}</td>
                    <td>
                      <span className={`badge ${l.status.toLowerCase()}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>{l.notes}</td>
                    <td>{formatDate(l.followUp)}</td>
                    <td className="action-col">
                      <button className="update-btn" onClick={() => setModal({ ...l })}>
                        Update
                      </button>
                      <button className="delete-btn" onClick={() => deleteLead(l._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ================= LEADS DASHBOARD ================= */}
        {activePage === "leads" && (
          <>
            <h2>Leads Dashboard</h2>

            {/* STATUS CARDS */}
            <div className="stats cards">
              <div className="card light">
                <span>Total Leads</span>
                <strong>{total}</strong>
              </div>

              <div className="card light">
                <span>New Leads</span>
                <strong>{newCount}</strong>
              </div>

              <div className="card blue">
                <span>Contacted</span>
                <strong>{contacted}</strong>
              </div>

              <div className="card dark">
                <span>Converted</span>
                <strong>{converted}</strong>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="progress-section">
              <h3>Leads Progress</h3>

              {[
                { label: "New", value: newCount },
                { label: "Contacted", value: contacted },
                { label: "Converted", value: converted },
              ].map(item => (
                <div className="progress-row" key={item.label}>
                  <span>{item.label}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent(item.value)}%` }}
                    />
                  </div>
                  <span>{percent(item.value)}%</span>
                </div>
              ))}
            </div>

            {/* DONUT CHART */}
            <div className="donut-section">
              <div
                className="donut"
                style={{
                  background: `conic-gradient(
                    #93c5fd 0% ${percent(newCount)}%,
                    #3b82f6 ${percent(newCount)}% ${percent(newCount + contacted)}%,
                    #1e40af ${percent(newCount + contacted)}% 100%
                  )`
                }}
              >
                <div className="donut-center">
                  <strong>{total}</strong>
                  <span>Total Leads</span>
                </div>
              </div>

              <div className="donut-legend">
                <div><span className="dot new"></span> New</div>
                <div><span className="dot contacted"></span> Contacted</div>
                <div><span className="dot converted"></span> Converted</div>
              </div>
            </div>
          </>
        )}

      </main>

      {/* ================= UPDATE MODAL ================= */}
      {modal && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Update Lead</h3>

            <input value={modal.name} disabled />
            <input value={modal.email} disabled />

            <select
              value={modal.status}
              onChange={e => setModal({ ...modal, status: e.target.value })}
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Converted</option>
            </select>

            <textarea
              value={modal.notes}
              onChange={e => setModal({ ...modal, notes: e.target.value })}
            />

            <input
              type="date"
              value={modal.followUp || ""}
              onChange={e => setModal({ ...modal, followUp: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={saveUpdate}>Save</button>
              <button className="delete-btn" onClick={() => setModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
