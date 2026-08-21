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
        {error && <div className="error-message mb-6">{error}</div>}

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

        <div className="step-actions">
          <button onClick={onNext} className="btn-primary">Book Trial 🎾</button>
        </div>
      </div>
    </div>
  );
}

function Part2({ formData, setFormData, onNext, onBack, addChild, updateChild, removeChild, error, setError }: any) {
  return (
    <div className="step-container flex flex-col justify-center min-h-screen">
      <div className="step-inner">
        <div className="step-header">
          <span className="step-eyebrow">Getting to know you</span>
          <h1 className="step-title">Who is this trial for?</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="step-content">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, trialType: "adult", children: [] });
                setError(null);
              }}
              className={`rounded-full border-2 font-display font-extrabold uppercase tracking-wider py-4 transition-all text-base ${
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
              className={`rounded-full border-2 font-display font-extrabold uppercase tracking-wider py-4 transition-all text-base ${
                formData.trialType === "child"
                  ? "bg-black text-yellow border-black"
                  : "bg-white text-black border-black hover:bg-yellow"
              }`}
            >
              Child
            </button>
          </div>

          {formData.trialType === "child" && (
            <div className="form-section mb-8">
              <h3 className="section-title">Child Details</h3>
              {formData.children.map((child: Child, idx: number) => (
                <div key={idx} className="space-y-4 pb-6 border-b border-black last:border-b-0 last:pb-0">
                  {idx > 0 && <p className="font-display font-bold text-sm uppercase text-yellow">Child {idx + 1}</p>}
                  <div className="input-group">
                    <label className="input-label">First name</label>
                    <input
                      type="text"
                      placeholder="First name"
                      className="field-input"
                      value={child.firstName}
                      onChange={(e) => updateChild(idx, "firstName", e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Last name</label>
                    <input
                      type="text"
                      placeholder="Last name"
                      className="field-input"
                      value={child.lastName}
                      onChange={(e) => updateChild(idx, "lastName", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="input-group">
                      <label className="input-label">Age</label>
                      <select
                        className="field-select"
                        value={child.age}
                        onChange={(e) => updateChild(idx, "age", e.target.value)}
                      >
                        <option value="">Age</option>
                        {AGE_OPTIONS.map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">DOB</label>
                      <input
                        type="date"
                        className="field-input"
                        value={child.dateOfBirth}
                        onChange={(e) => updateChild(idx, "dateOfBirth", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Previous playing experience</label>
                    <select
                      className="field-select"
                      value={child.experience}
                      onChange={(e) => updateChild(idx, "experience", e.target.value)}
                    >
                      <option value="">Previous playing experience</option>
                      {EXPERIENCE_OPTIONS.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">School (optional)</label>
                    <input
                      type="text"
                      placeholder="School (optional)"
                      className="field-input"
                      value={child.school}
                      onChange={(e) => updateChild(idx, "school", e.target.value)}
                    />
                  </div>
                  {formData.children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild(idx)}
                      className="text-red-600 font-display font-bold text-xs uppercase hover:underline mt-4"
                    >
                      - Remove child
                    </button>
                  )}
                </div>
              ))}
              {formData.children.length < 3 && (
                <button
                  type="button"
                  onClick={addChild}
                  className="w-full py-4 rounded-full border-2 border-black text-black font-display font-bold uppercase text-sm hover:bg-yellow transition-all mt-6"
                >
                  + Add another child
                </button>
              )}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Where did you hear about us?</label>
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

        <div className="step-actions">
          <button onClick={onNext} className="btn-primary">Next</button>
          <button onClick={onBack} className="btn-ghost">Back</button>
        </div>
      </div>
    </div>
  );
}

function Part3({ formData, setFormData, onSubmit, onBack, error, setError, submitting }: any) {
  const [selectedChildForTime, setSelectedChildForTime] = useState<number>(0);

  return (
    <div className="step-container flex flex-col justify-center min-h-screen">
      <div className="step-inner">
        <div className="step-header">
          <span className="step-eyebrow">Almost there</span>
          <h1 className="step-title">Complete your registration</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="step-content">
          <div className="input-group">
            <label className="input-label">Address</label>
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

          <div className="form-section">
            <h3 className="section-title">Emergency Contact</h3>
            <div className="input-group">
              <label className="input-label">Name</label>
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
              <label className="input-label">Phone number</label>
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
              <label className="input-label">Relationship</label>
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
              <label className="input-label">Email</label>
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

          <div>
            <h3 className="font-display font-extrabold text-lg uppercase tracking-widest text-black mb-6">Pick your trial time</h3>
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

            <div className="space-y-3">
              {MOCK_TIME_SLOTS.map(slot => (
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
                  className={`w-full rounded-full border-2 p-4 text-left font-sans transition-all text-base ${
                    (formData.trialType === "adult" ? formData.children[0]?.selectedTime : formData.children[selectedChildForTime]?.selectedTime) === slot.id
                      ? "bg-black border-black text-yellow"
                      : "border-black hover:bg-yellow"
                  }`}
                >
                  <div className="font-display font-bold uppercase text-sm">{slot.day}</div>
                  <div className="text-sm mt-1">{slot.time}</div>
                  <div className="text-xs mt-1 opacity-80">{slot.coach}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="step-actions">
          <button onClick={onSubmit} disabled={submitting} className="btn-primary">
            {submitting ? "Submitting..." : "Submit registration"}
          </button>
          <button onClick={onBack} disabled={submitting} className="btn-ghost">Back</button>
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
