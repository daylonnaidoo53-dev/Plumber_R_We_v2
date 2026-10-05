# Plumber R We (Version 2)

**Version 2** of the Plumber R We website — modernized, fully responsive, and populated with verified business information for **Paarl & the Cape Winelands, South Africa**.

Live Firebase Deployment: **[https://plumber-r-we.web.app](https://plumber-r-we.web.app)**

---

## What’s New in Version 2

1. **Verified Paarl Business Details**:
   - Primary Phone / 24/7 Hotline: `082 486 5490` (`+27 82 486 5490`)
   - Secondary Line: `079 542 0032` (`+27 79 542 0032`)
   - Direct WhatsApp: `082 486 5490` with pre-filled message triggers
   - Verified Emails: `plumberrwe@gmail.com` and `plumberrweoffice@gmail.com`
   - Location: Main Rd, Paarl, Western Cape, 7646

2. **UI/UX & Design System Transformation**:
   - Modern typography using Google Fonts (`Outfit` for bold headings, `Plus Jakarta Sans` for clean UI body).
   - Glassmorphic navigation header with live scroll progress indicator.
   - High-contrast 24/7 Emergency Announcement Bar with live green pulse.
   - Generated high-resolution architectural imagery:
     - `public/images/luxury-renovation.jpg` (Master bathroom renovation)
     - `public/images/expert-plumber.jpg` (Certified plumber technician avatar)

3. **Interactive Features**:
   - **Interactive Cost Estimator & Problem Diagnostic**: Customers select common issues (Burst Geyser, Blocked Drain, Leak Detection, Taps/Toilets, Emergency) to view pricing guides and turnaround times, with one-click form pre-filling.
   - **Local Winelands Coverage Explorer**: Clickable area chips (Paarl Central, Courtrai, Val de Vie, Wellington, Franschhoek, etc.) that provide local ETA estimates.
   - **Direct WhatsApp Quote Submission**: Quick "Send Form via WhatsApp" action that formats entered details directly into WhatsApp.
   - **Mobile Sticky Action Bar**: One-tap calling and WhatsApp buttons fixed to the bottom on mobile viewports.

4. **Preserved Reliability & Tests**:
   - Firestore `leads` collection integration remains intact.
   - Automated test suite passes 5/5 assertions.

---

## Local Development

```sh
npm start       # Start preview at http://127.0.0.1:5000
npm run check   # Syntax checking on all JavaScript modules
npm test        # Run unit tests
```

## Firebase Deployment

Deploy directly via Firebase CLI:
```sh
firebase deploy --only hosting --project plumber-r-we
```
