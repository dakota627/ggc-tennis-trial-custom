# GGC Tennis Trial - Custom Form

A custom Next.js form for tennis trial signups with Court 16 design system integration.

## Features

- **3-Part Form Flow**
  - Part 1: Basic info (name, email, phone, location)
  - Part 2: Trial type (adult/child) + child details + how heard
  - Part 3: Address + emergency contact + time selection
  
- **HubSpot Integration**
  - Partial captures at each step
  - Updates contact information progressively
  
- **Court 16 Design System**
  - Bold, athletic, playful aesthetic
  - Black/white/yellow color scheme
  - Pill-shaped buttons and form inputs
  - Extrabold uppercase typography

- **Multi-Child Support**
  - Up to 3 children per signup
  - Individual time slot selection per child
  - Validation ensures all children have selected times

## Environment Setup

Create a `.env.local` file:

```
HUBSPOT_API_KEY=your_hubspot_api_key_here
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Vercel:

```bash
vercel
```

## HubSpot Properties

The form creates the following custom properties in HubSpot:
- `ggc_location` - Selected location
- `ggc_trial_type` - adult or child
- `ggc_how_heard` - How they heard about us
- `ggc_emergency_contact_name` - Emergency contact name
- `ggc_emergency_contact_phone` - Emergency contact phone
- `ggc_emergency_contact_relationship` - Emergency contact relationship
- `ggc_emergency_contact_email` - Emergency contact email
- `ggc_children` - JSON array of child information with selected times
