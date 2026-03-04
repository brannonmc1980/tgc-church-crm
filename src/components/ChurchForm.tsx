"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Church } from "@/lib/types";

type ChurchFormProps = {
  church?: Partial<Church>;
  onSubmit: (data: FormData) => Promise<{ error?: string; id?: string }>;
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY"
];

const ENGAGEMENT_STATUSES = [
  { value: "COUNCIL", label: "Council", description: "Pastor serves on TGC Council" },
  { value: "ENGAGED", label: "Engaged", description: "Attends/sends to conferences, listed on TGC directory" },
  { value: "AWARE", label: "Aware", description: "Familiar with TGC, positive relationship" },
  { value: "POTENTIAL", label: "Potential", description: "Could become engaged, needs cultivation" },
  { value: "LOW_POTENTIAL", label: "Low Potential", description: "Unlikely to engage" },
  { value: "OPPOSED", label: "Opposed", description: "Actively opposed to TGC" },
];

export default function ChurchForm({ church, onSubmit }: ChurchFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "staff" | "social" | "status">("info");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await onSubmit(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.id) {
      router.push(`/churches/${result.id}`);
      router.refresh();
    }
  }

  const tabs = [
    { id: "info" as const, label: "Church Info" },
    { id: "staff" as const, label: "Pastoral Staff" },
    { id: "social" as const, label: "Social & Notes" },
    { id: "status" as const, label: "Engagement" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? "border-sage text-sage"
                : "border-transparent text-stone-500 hover:text-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Church Info Tab */}
      {activeTab === "info" && (
        <div className="space-y-4">
          <div>
            <label className="label">Church Name *</label>
            <input name="name" required defaultValue={church?.name ?? ""} className="input" placeholder="Grace Community Church" />
          </div>
          <div>
            <label className="label">Denomination</label>
            <input name="denomination" defaultValue={church?.denomination ?? ""} className="input" placeholder="e.g. PCA, SBC, Non-denominational" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <input name="phone" type="tel" defaultValue={church?.phone ?? ""} className="input" placeholder="(555) 000-0000" />
            </div>
            <div>
              <label className="label">Website</label>
              <input name="website" type="url" defaultValue={church?.website ?? ""} className="input" placeholder="https://example.com" />
            </div>
          </div>
          <div>
            <label className="label">Street Address</label>
            <input name="address" defaultValue={church?.address ?? ""} className="input" placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="label">City</label>
              <input name="city" defaultValue={church?.city ?? ""} className="input" placeholder="Greenville" />
            </div>
            <div>
              <label className="label">State</label>
              <select name="state" defaultValue={church?.state ?? ""} className="input">
                <option value="">Select state</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">ZIP Code</label>
              <input name="zip" defaultValue={church?.zip ?? ""} className="input" placeholder="29601" />
            </div>
          </div>
        </div>
      )}

      {/* Pastoral Staff Tab */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-navy mb-3 pb-2 border-b border-stone-100">Lead Pastor</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Pastor Name</label>
                <input name="pastorName" defaultValue={church?.pastorName ?? ""} className="input" placeholder="Rev. John Smith" />
              </div>
              <div>
                <label className="label">Pastor Email</label>
                <input name="pastorEmail" type="email" defaultValue={church?.pastorEmail ?? ""} className="input" placeholder="pastor@church.com" />
              </div>
              <div>
                <label className="label">Pastor Cell</label>
                <input name="pastorCell" type="tel" defaultValue={church?.pastorCell ?? ""} className="input" placeholder="(555) 000-0000" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy mb-3 pb-2 border-b border-stone-100">Associate Pastor</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Associate Pastor Name</label>
                <input name="associatePastorName" defaultValue={church?.associatePastorName ?? ""} className="input" placeholder="Rev. James Johnson" />
              </div>
              <div>
                <label className="label">Associate Pastor Email</label>
                <input name="associatePastorEmail" type="email" defaultValue={church?.associatePastorEmail ?? ""} className="input" placeholder="associate@church.com" />
              </div>
              <div>
                <label className="label">Associate Pastor Cell</label>
                <input name="associatePastorCell" type="tel" defaultValue={church?.associatePastorCell ?? ""} className="input" placeholder="(555) 000-0000" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social & Notes Tab */}
      {activeTab === "social" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-navy mb-3 pb-2 border-b border-stone-100">Social Media</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Facebook</label>
                <input name="facebook" defaultValue={church?.facebook ?? ""} className="input" placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className="label">Instagram</label>
                <input name="instagram" defaultValue={church?.instagram ?? ""} className="input" placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="label">Twitter / X</label>
                <input name="twitter" defaultValue={church?.twitter ?? ""} className="input" placeholder="https://twitter.com/..." />
              </div>
              <div>
                <label className="label">YouTube</label>
                <input name="youtube" defaultValue={church?.youtube ?? ""} className="input" placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>
          <div>
            <label className="label">Internal Notes</label>
            <textarea
              name="notes"
              defaultValue={church?.notes ?? ""}
              className="input h-32 resize-none"
              placeholder="Private notes about this church relationship..."
            />
          </div>
        </div>
      )}

      {/* Engagement Status Tab */}
      {activeTab === "status" && (
        <div className="space-y-3">
          <p className="text-sm text-stone-500 mb-4">Select the engagement level for this church&apos;s relationship with TGC.</p>
          {ENGAGEMENT_STATUSES.map((s) => (
            <label key={s.value} className="flex items-start gap-3 p-3 rounded-lg border border-stone-200 hover:border-sage/50 cursor-pointer has-[:checked]:border-sage has-[:checked]:bg-sage/5 transition-colors">
              <input
                type="radio"
                name="status"
                value={s.value}
                defaultChecked={church?.status === s.value}
                className="mt-0.5 accent-sage"
              />
              <div>
                <p className="text-sm font-medium text-navy">{s.label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{s.description}</p>
              </div>
            </label>
          ))}
          <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-200 hover:border-stone-300 cursor-pointer has-[:checked]:border-stone-300 transition-colors">
            <input type="radio" name="status" value="" defaultChecked={!church?.status} className="mt-0.5" />
            <div>
              <p className="text-sm font-medium text-stone-500">No Status</p>
              <p className="text-xs text-stone-400 mt-0.5">Leave unclassified</p>
            </div>
          </label>
        </div>
      )}

      {/* Navigation between tabs */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-stone-100">
        <div className="flex gap-2">
          {activeTab !== "info" && (
            <button
              type="button"
              onClick={() => {
                const order = ["info", "staff", "social", "status"] as const;
                const idx = order.indexOf(activeTab);
                setActiveTab(order[idx - 1]);
              }}
              className="btn-secondary"
            >
              ← Back
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {activeTab !== "status" ? (
            <button
              type="button"
              onClick={() => {
                const order = ["info", "staff", "social", "status"] as const;
                const idx = order.indexOf(activeTab);
                setActiveTab(order[idx + 1]);
              }}
              className="btn-primary"
            >
              Next →
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? "Saving..." : church?.name ? "Save Changes" : "Add Church"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
