import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const IdeaDetails = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/ideas/${id}`)
      .then((res) => setIdea(res.data));
  }, [id]);

  if (!idea) return <div>Loading...</div>;

  const analysis = idea?.analysis || {};

  // --- SAFE HELPERS ---
  const safeText = (value) => {
    if (!value) return "No data available";
    if (typeof value === "string") return value;
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const safeCustomer = () => {
    if (!analysis.customer) return "No customer data";
    return typeof analysis.customer === "string"
      ? analysis.customer
      : analysis.customer.persona || JSON.stringify(analysis.customer);
  };

  const safeCompetitors = () => {
    if (!analysis.competitors) return [];
    if (Array.isArray(analysis.competitors)) {
      return analysis.competitors.map((c) =>
        typeof c === "string" ? c : `${c.name} — ${c.difference}`
      );
    }
    return [String(analysis.competitors)];
  };

  return (
    <div className="space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900">{idea.title}</h1>
        <p className="text-xl text-gray-600 mt-2">{idea.description}</p>
      </header>

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500 uppercase text-xs font-bold">
            Profitability
          </p>
          <p className="text-4xl font-bold text-green-600">
            {analysis.profitability_score ?? "—"}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500 uppercase text-xs font-bold">
            Risk Level
          </p>
          <p
            className={`text-4xl font-bold ${
              analysis.risk_level === "High" ? "text-red-500" : "text-blue-500"
            }`}
          >
            {analysis.risk_level ?? "—"}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <Section
          title="Problem & Market"
          content={`${safeText(analysis.problem)} ${safeText(analysis.market)}`}
        />

        <Section title="Target Customer" content={safeCustomer()} />

        {/* Competitors */}
        <div>
          <h3 className="font-bold text-lg mb-2">Competitors</h3>
          <ul className="list-disc pl-5">
            {safeCompetitors().map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="font-bold text-lg mb-2">Recommended Stack</h3>
          <div className="flex gap-2 flex-wrap">
            {(analysis.tech_stack || []).map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Justification */}
        <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
          <p className="italic text-gray-700">
            "{safeText(analysis.justification)}"
          </p>
        </div>
      </div>
    </div>
  );
};

// Section Component
const Section = ({ title, content }) => (
  <div>
    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
    <p className="text-gray-600 whitespace-pre-line">{content}</p>
  </div>
);

export default IdeaDetails;
