"use client";

import { useState } from "react";
import { FormData, TrialType, Child, LOCATIONS, HOW_HEARD_OPTIONS, AGE_OPTIONS, EXPERIENCE_OPTIONS, MOCK_TIME_SLOTS } from "@/lib/types";
import { createOrUpdateContact } from "@/lib/hubspot";

export default function TrialForm() {
  const [step, setStep] = useState<"part1" | "part2" | "part3" | "success">("part1");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    location: "",
    trialType: null,
    howHeard: "",
    children: [],
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    emergencyContactEmail: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePart1Next = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.location) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);
    try {
      await createOrUpdateContact(formData, "part1");
      setStep("part2");
    } catch (err) {
      setError("Failed to save. Please try again.");
    }
  };

  const handlePart2Next = async () => {
    if (!formData.trialType || !formData.howHeard) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.trialType === "child" && formData.children.length === 0) {
      setError("Please add at least one child");
      return;
    }

    setError(null);
    try {
      await createOrUpdateContact(formData, "part2");
      setStep("part3");
    } catch (err) {
      setError("Failed to save. Please try again.");
    }
  };

  const handlePart3Submit = async () => {
    if (!formData.address.trim() || !formData.emergencyContactName.trim() || !formData.emergencyContactPhone.trim() || !formData.emergencyContactRelationship || !formData.emergencyContactEmail.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.trialType === "child") {
      const allChildrenHaveTime = formData.children.every(child => child.selectedTime);
      if (!allChildrenHaveTime) {
        setError("You haven't selected a session for all children");
        return;
      }
    }

    setError(null);
    setSubmitting(true);
    try {
      await createOrUpdateContact(formData, "part3");
      setStep("success");
    } catch (err) {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const addChild = () => {
    if (formData.children.length < 3) {
      setFormData(prev => ({
        ...prev,
        children: [...prev.children, { firstName: "", lastName: "", age: "", dateOfBirth: "", experience: "", school: "" }]
      }));
    }
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    setFormData(prev => {
      const newChildren = [...prev.children];
      newChildren[index] = { ...newChildren[index], [field]: value };
      return { ...prev, children: newChildren };
    });
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {step === "part1" && (
        <Part1
          formData={formData}
          setFormData={setFormData}
          onNext={handlePart1Next}
          error={error}
          setError={setError}
        />
      )}

      {step === "part2" && (
        <Part2
          formData={formData}
          setFormData={setFormData}
          onNext={handlePart2Next}
          onBack={() => setStep("part1")}
          addChild={addChild}
          updateChild={updateChild}
          removeChild={removeChild}
          error={error}
          setError={setError}
        />
      )}

      {step === "part3" && (
        <Part3
          formData={formData}
          setFormData={setFormData}
          onSubmit={handlePart3Submit}
          onBack={() => setStep("part2")}
          error={error}
          setError={setError}
          submitting={submitting}
        />
      )}

      {step === "success" && <SuccessScreen />}
    </div>
  );
}

function Part1({ formData, setFormData, onNext, error, setError }: any) {
  return (
    <div className="step-container flex flex-col justify-center min-h-screen">
      <div className="step-inner">
        <div className="step-content">
          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                className="field-input"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  setError(null);
                }}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                className="field-input"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  setError(null);
                }}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              className="field-input"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                setError(null);
              }}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="field-input"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setError(null);
              }}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Location</label>
            <select
              className="field-select"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
                setError(null);
              }}
            >
              <option value="">Select a location</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm font-semibold mt-6 mb-3">{error}</p>}

        <div className="step-actions">
          <button onClick={onNext} className="btn-primary">Book Trial 🎾</button>
        </div>
      </div>
    </div>
  );
}

function Part2({ formData, setFormData, onNext, onBack, addChild, updateChild, removeChild, error, setError }: any) {
  return (
    <div className="step-container flex flex-col justify-center min-h-auto">
      <div className="step-inner">
        <div className="step-content">
          <div className="mb-6">
            <p className="font-display font-bold uppercase text-sm tracking-wider text-black mb-4">Who is this trial for?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, trialType: "adult", children: [] });
                  setError(null);
                }}
                className={`rounded-full border-2 font-display font-bold uppercase tracking-wider py-3 transition-all text-sm ${
                  formData.trialType === "adult"
                    ? "bg-black text-yellow border-black"
                    : "bg-white text-black border-black hover:bg-yellow"
                }`}
              >
                Adult (18+ yrs)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, trialType: "child", children: formData.children.length === 0 ? [{ firstName: "", lastName: "", age: "", dateOfBirth: "", experience: "", school: "" }] : formData.children });
                  setError(null);
                }}
                className={`rounded-full border-2 font-display font-bold uppercase tracking-wider py-3 transition-all text-sm ${
                  formData.trialType === "child"
                    ? "bg-black text-yellow border-black"
                    : "bg-white text-black border-black hover:bg-yellow"
                }`}
              >
                Child
              </button>
            </div>
          </div>


          <div>
            <p className="font-display font-bold uppercase text-sm tracking-wider text-black mb-3">Where did you hear about us?</p>
            <select
              className="field-select"
              value={formData.howHeard}
              onChange={(e) => {
                setFormData({ ...formData, howHeard: e.target.value });
                setError(null);
              }}
            >
              <option value="">Select a channel</option>
              {HOW_HEARD_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm font-semibold mt-4 mb-3">{error}</p>}

        <div className="step-actions mt-6">
          <button onClick={onNext} className="btn-primary">Next</button>
        </div>
      </div>
    </div>
  );
}

function Part3({ formData, setFormData, onSubmit, onBack, error, setError, submitting }: any) {
  const [selectedChildForTime, setSelectedChildForTime] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7)); // August 2026

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthDays = Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null);

  return (
    <div className="step-container flex flex-col justify-start min-h-auto">
      <div className="step-inner">
        <div className="step-content space-y-8">
          {/* Address Section */}
          <div>
            <p className="font-display font-bold uppercase text-xs tracking-widest text-black mb-6">Step 1 of 2 - Address of the player</p>
            <div className="space-y-5">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Street address"
                  className="field-input"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    setError(null);
                  }}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="City"
                  className="field-input"
                  value={formData.city || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    setError(null);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="State"
                    className="field-input"
                    value={formData.state || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, state: e.target.value });
                      setError(null);
                    }}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="ZIP code"
                    className="field-input"
                    value={formData.zip || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, zip: e.target.value });
                      setError(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="border-t pt-8">
            <p className="font-display font-bold uppercase text-xs tracking-widest text-black mb-6">Emergency Contact</p>
            <div className="space-y-5">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Name"
                  className="field-input"
                  value={formData.emergencyContactName}
                  onChange={(e) => {
                    setFormData({ ...formData, emergencyContactName: e.target.value });
                    setError(null);
                  }}
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="field-input"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => {
                    setFormData({ ...formData, emergencyContactPhone: e.target.value });
                    setError(null);
                  }}
                />
              </div>
              <div className="input-group">
                <select
                  className="field-select"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => {
                    setFormData({ ...formData, emergencyContactRelationship: e.target.value });
                    setError(null);
                  }}
                >
                  <option value="">Relationship</option>
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  className="field-input"
                  value={formData.emergencyContactEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, emergencyContactEmail: e.target.value });
                    setError(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="border-t pt-8">
            <h3 className="font-display font-extrabold text-2xl uppercase tracking-wider text-black mb-2">Pick your trial time</h3>
            <p className="text-sm text-black mb-6">{formData.location} — choose a highlighted day, then request a class.</p>

            {formData.trialType === "child" && formData.children.length > 0 && (
              <div className="input-group mb-6">
                <label className="input-label">Select child</label>
                <select
                  className="field-select"
                  value={selectedChildForTime}
                  onChange={(e) => setSelectedChildForTime(parseInt(e.target.value))}
                >
                  {formData.children.map((child: Child, idx: number) => (
                    <option key={idx} value={idx}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="col-span-2">
                <div className="border-4 border-black rounded-2xl p-6 bg-white">
                  <div className="bg-yellow p-4 rounded-xl mb-6 flex items-center justify-between">
                    <button type="button" className="text-2xl">‹</button>
                    <h4 className="font-display font-extrabold text-xl">August 2026</h4>
                    <button type="button" className="text-2xl">›</button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                      <div key={day} className="text-center font-display font-bold text-xs py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {[...emptyDays, ...monthDays].map((day, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`aspect-square rounded-lg font-display font-bold flex items-center justify-center text-sm transition-all ${
                          day === 25
                            ? "bg-yellow border-2 border-black text-black"
                            : day
                            ? "border-2 border-gray-300 hover:border-black"
                            : ""
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Available Times */}
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="font-display font-bold uppercase text-xs mb-2">Tuesday, August 25</p>
                  <p className="text-xs text-gray-600">3 classes shown</p>
                </div>
                {MOCK_TIME_SLOTS.slice(0, 3).map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      const newChildren = [...formData.children];
                      if (formData.trialType === "adult") {
                        setFormData({ ...formData, children: [{ ...newChildren[0], selectedTime: slot.id }] });
                      } else {
                        newChildren[selectedChildForTime].selectedTime = slot.id;
                        setFormData({ ...formData, children: newChildren });
                      }
                      setError(null);
                    }}
                    className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                      (formData.trialType === "adult" ? formData.children[0]?.selectedTime : formData.children[selectedChildForTime]?.selectedTime) === slot.id
                        ? "border-black bg-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-2 ${
                      slot.id === "1" ? "bg-yellow text-black" :
                      slot.id === "2" ? "bg-yellow text-black" :
                      "bg-yellow text-black"
                    }`}>
                      {slot.id === "1" ? "ADULT" : slot.id === "2" ? "FRESHMAN" : "ROOKIE"}
                    </span>
                    <div className="font-display font-bold text-sm">{slot.time}</div>
                    <div className="text-xs text-gray-600">{slot.coach}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm font-semibold mt-6 mb-3">{error}</p>}

        <div className="step-actions mt-8">
          <button onClick={onSubmit} disabled={submitting} className="btn-primary">
            {submitting ? "Submitting..." : "Submit registration"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="success-container">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-10 h-10">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <span className="step-eyebrow">You're all set</span>
      <h2 className="step-title mb-6">Thanks for signing up!</h2>
      <p className="text-lg text-black max-w-md leading-relaxed">We've received your trial registration. A member of the Good Game Collective tennis team will reach out shortly to confirm your trial time.</p>
    </div>
  );
}
