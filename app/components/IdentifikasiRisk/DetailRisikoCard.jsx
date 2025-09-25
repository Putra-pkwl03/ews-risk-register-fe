"use client";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getUsers } from "../../lib/userApi"; 
import FishboneModal from "../diagram/FishboneModal";
import FishboneChart from "../diagram/FishboneChart";


export default function DetailRisikoCard({ risk, onClose }) {

  const [users, setUsers] = useState([]);
  const [showFishbone, setShowFishbone] = useState(false);
  const uc_c_display = risk.uc_c === 0 ? "UC" : risk.uc_c === 1 ? "C" : risk.uc_c;

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  if (!risk) return null;

  const creatorName =
    users.find((u) => u.id === risk.created_by)?.name || "Unknown";

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 mx-auto mt-3">
      <button
        onClick={() => {
          // Remove `ref` query param from URL
          const params = new URLSearchParams(window.location.search);
          params.delete("ref");
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.pushState({}, "", newUrl);

          // Jalankan fungsi close dari parent
          onClose();
        }}
        className="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1 hover:cursor-pointer" />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Risk Details</h2>

      {/* Info utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-8">
        <DetailItem label="Risk Name" value={risk.name} />
        <DetailItem label="Category" value={risk.category} />
        <DetailItem label="Cluster" value={risk.cluster} />
        <DetailItem label="Unit" value={risk.unit} />
        <DetailItem label="Impact" value={risk.impact} />
        <DetailItem label="UC_C" value={uc_c_display} />
        <DetailItem label="Status" value={risk.status} capitalize />
        <DetailItem label="Created by" value={creatorName} />
        <DetailItem label="Created at" value={formatDate(risk.created_at)} />
        <DetailItem label="Last updated" value={formatDate(risk.updated_at)} />
        <DetailItem label="Description" value={risk.description || "-"} spanFull />
      </div>

      {/* Causes & Sub Causes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] text-gray-600 font-semibold">Causes</h3>
          <button
            onClick={() => setShowFishbone(true)}
            className="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer"
          >
            View Decision Tree
          </button>
        </div>

        {risk.causes && risk.causes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {risk.causes.map((cause) => (
              <div
                key={cause.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800"
              >
                <div className="mb-2">
                  <strong className="text-[16px] font-semibold">Category:</strong>{" "}
                  <span className="capitalize text-[14px]">{cause.category}</span>
                </div>
                <div className="mb-2">
                  <strong className="text-[16px] font-semibold">Main Cause:</strong>{" "}
                  <span className="capitalize text-[14px]">{cause.main_cause}</span>
                </div>
                {cause.sub_causes && cause.sub_causes.length > 0 && (
                  <div className="ml-4 mt-3 text-[14px] text-gray-600 font-semibold">
                    <strong>Sub Causes:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[14px]">
                      {cause.sub_causes.map((sub) => (
                        <li key={sub.id}>{sub.sub_cause}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recorded causes.</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl w-full hover:cursor-pointer"
      >
        Close Details
      </button>

      <FishboneModal isOpen={showFishbone} onClose={() => setShowFishbone(false)}>
        <FishboneChart causes={risk.causes || []} riskName={risk.name} />
      </FishboneModal>
    </div>
  );
}

// Helper component for each detail item
function DetailItem({ label, value, capitalize = false, spanFull = false }) {
  return (
    <div className={`${spanFull ? "md:col-span-2" : ""}`}>
      <div className="text-gray-500 font-medium mb-1">{label}</div>
      <div className={`p-3 bg-gray-100 rounded-xl ${capitalize ? "capitalize" : ""}`}>
        {value}
      </div>
    </div>
  );
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
