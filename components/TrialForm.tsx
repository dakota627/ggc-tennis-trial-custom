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
      <div className="step-header">
        <div className="step-eyebrow">Good Game Collective · Tennis</div>
        <h1 className="step-title">Sign up for a tennis trial</h1>
        <p className="step-subtitle">Takes about 5 minutes. We'll ask a few questions about you and the best way to reach you.</p>
      </div>

      {error && <div className="error-message mb-6">{error}</div>}

      <div className="step-content">
        <div className="grid grid-cols-2 gap-4">
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

        <input
          type="tel"
          placeholder="Phone Number"
          className="field-input"
          value={formData.phone}
          onChange={(e) => {
            setFormData({ ...formData, phone: e.target.value });
            setError(null);
          }}
        />

        <input
          type="email"
          placeholder="Email"
          className="field-input"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            setError(null);
          }}
        />

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

      <div className="step-actions">
        <button onClick={onNext} className="btn-primary">Book Trial 🎾</button>
      </div>
    </div>
  );
}

function Part2({ formData, setFormData, onNext, onBack, addChild, updateChild, removeChild, error, setError }: any) {
  return (
    <div className="step-container flex flex-col justify-center min-h-screen">
      <div className="step-header">
        <div className="step-eyebrow">Getting to know you</div>
        <h1 className="step-title">Who is this trial for?</h1>
      </div>

      {error && <div className="error-message mb-6">{error}</div>}

      <div className="step-content">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, trialType: "adult", children: [] });
              setError(null);
            }}
            className={`rounded-full border-2 font-display font-extrabold uppercase tracking-wider py-3 transition-all ${
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
            className={`rounded-full border-2 font-display font-extrabold uppercase tracking-wider py-3 transition-all ${
              formData.trialType === "child"
                ? "bg-black text-yellow border-black"
                : "bg-white text-black border-black hover:bg-yellow"
            }`}
          >
            Child
          </button>
        </div>

        {formData.trialType === "child" && (
          <div className="space-y-6 mb-6 bg-yellow bg-opacity-5 p-6 rounded-2xl border-2 border-yellow">
            <h3 className="font-display font-extrabold text-lg uppercase">Child Details</h3>
            {formData.children.map((child: Child, idx: number) => (
              <div key={idx} className="space-y-4 pb-4 border-b border-black last:border-b-0">
                <p className="font-display font-bold text-sm uppercase text-yellow">Child {idx + 1}</p>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    className="field-input"
                    value={child.firstName}
                    onChange={(e) => updateChild(idx, "firstName", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="field-input"
                    value={child.lastName}
                    onChange={(e) => updateChild(idx, "lastName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <input
                    type="date"
                    className="field-input"
                    value={child.dateOfBirth}
                    onChange={(e) => updateChild(idx, "dateOfBirth", e.target.value)}
                  />
                </div>
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
                <input
                  type="text"
                  placeholder="School (optional)"
                  className="field-input"
                  value={child.school}
                  onChange={(e) => updateChild(idx, "school", e.target.value)}
                />
                {formData.children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(idx)}
                    className="text-red-600 font-semibold text-sm hover:underline"
                  >
                    Remove child
                  </button>
                )}
              </div>
            ))}
            {formData.children.length < 3 && (
              <button
                type="button"
                onClick={addChild}
                className="w-full py-3 rounded-full border-2 border-black text-black font-display font-bold uppercase hover:bg-yellow transition-all"
              >
                + Add another child
              </button>
            )}
          </div>
        )}

        <div>
          <label className="block font-display font-bold uppercase text-sm mb-3">Where did you hear about us?</label>
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
  );
}

function Part3({ formData, setFormData, onSubmit, onBack, error, setError, submitting }: any) {
  const [selectedChildForTime, setSelectedChildForTime] = useState<number>(0);

  return (
    <div className="step-container flex flex-col justify-center min-h-screen">
      <div className="step-header">
        <div className="step-eyebrow">Almost there</div>
        <h1 className="step-title">Complete your registration</h1>
      </div>

      {error && <div className="error-message mb-6">{error}</div>}

      <div className="step-content space-y-6">
        <div>
          <label className="block font-display font-bold uppercase text-sm mb-3">Address</label>
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

        <div className="bg-yellow bg-opacity-5 p-6 rounded-2xl border-2 border-yellow space-y-4">
          <h3 className="font-display font-extrabold text-lg uppercase">Emergency Contact</h3>
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

        <div>
          <h3 className="font-display font-extrabold text-lg uppercase mb-4">Pick your trial time</h3>
          {formData.trialType === "child" && formData.children.length > 0 && (
            <select
              className="field-select mb-4"
              value={selectedChildForTime}
              onChange={(e) => setSelectedChildForTime(parseInt(e.target.value))}
            >
              {formData.children.map((child: Child, idx: number) => (
                <option key={idx} value={idx}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>
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
                className={`w-full rounded-full border-2 p-4 text-left font-sans transition-all ${
                  (formData.trialType === "adult" ? formData.children[0]?.selectedTime : formData.children[selectedChildForTime]?.selectedTime) === slot.id
                    ? "bg-black border-black text-yellow"
                    : "border-black hover:bg-yellow"
                }`}
              >
                <div className="font-display font-bold uppercase">{slot.day}</div>
                <div className="text-sm">{slot.time}</div>
                <div className="text-xs mt-1">{slot.coach}</div>
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
  );
}

function SuccessScreen() {
  return (
    <div className="success-container">
      <div className="success-icon mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div className="step-eyebrow mb-2">You're all set</div>
      <h2 className="step-title mb-4">Thanks for signing up!</h2>
      <p className="text-base text-black max-w-md">We've received your trial registration. A member of the Good Game Collective tennis team will reach out shortly to confirm your trial time.</p>
    </div>
  );
}
