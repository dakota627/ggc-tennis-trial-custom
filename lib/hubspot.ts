import { FormData } from "./types";

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

export async function createOrUpdateContact(data: Partial<FormData>, step: "part1" | "part2" | "part3") {
  if (!HUBSPOT_API_KEY) {
    console.warn("HUBSPOT_API_KEY not set");
    return;
  }

  const properties: Record<string, any> = {};

  if (step === "part1" || step === "part2" || step === "part3") {
    if (data.firstName) properties.firstname = data.firstName;
    if (data.lastName) properties.lastname = data.lastName;
    if (data.email) properties.email = data.email;
    if (data.phone) properties.phone = data.phone;
    if (data.location) properties.ggc_location = data.location;
  }

  if (step === "part2" || step === "part3") {
    if (data.trialType) properties.ggc_trial_type = data.trialType;
    if (data.howHeard) properties.ggc_how_heard = data.howHeard;
  }

  if (step === "part3") {
    if (data.address) properties.address = data.address;
    if (data.emergencyContactName) properties.ggc_emergency_contact_name = data.emergencyContactName;
    if (data.emergencyContactPhone) properties.ggc_emergency_contact_phone = data.emergencyContactPhone;
    if (data.emergencyContactRelationship) properties.ggc_emergency_contact_relationship = data.emergencyContactRelationship;
    if (data.emergencyContactEmail) properties.ggc_emergency_contact_email = data.emergencyContactEmail;
    if (data.children && data.children.length > 0) {
      properties.ggc_children = JSON.stringify(data.children);
    }
  }

  try {
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
      },
      body: JSON.stringify({
        properties,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("HubSpot error:", error);
      throw new Error(error.message || "Failed to create contact");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating/updating contact:", error);
    throw error;
  }
}
