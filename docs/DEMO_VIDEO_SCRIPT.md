# 🎬 ReClothing — Official Demo Video Script
**Target Duration:** 5 to 7 Minutes  
**Project:** ReClothing (Campus Thrift & Clothing Exchange Marketplace)  
**Stack:** MongoDB Atlas · Express.js · React + Vite · Node.js · Tailwind CSS  
**Audience:** College Evaluators, Faculty Judges, End-Term Capstone Committee  

---

## 📋 Pre-Recording Checklist
1. **Database:** Ensure MongoDB Atlas is seeded (`npm run seed` in `server/`).
2. **Browser Setup:** Open `http://localhost:5173` (or your live Vercel URL) in an incognito or fresh browser window at 1080p (1920x1080) resolution.
3. **Demo Accounts:** Keep demo credentials handy:
   - **Student Seller/Buyer:** `elena@campus.edu` / `password123`
   - **Student Peer:** `marcus@campus.edu` / `password123`
   - **Admin:** `sanskarbhanderi08@gmail.com` / `password123`
4. **Microphone Check:** Ensure clean audio with minimal background noise.

---

## ⏱️ Video Timeline Overview
| Timestamp | Scene / Segment | Key Focus |
| :--- | :--- | :--- |
| `0:00 - 0:45` | **Scene 1: Introduction & Problem Statement** | Hook, Fast-fashion crisis, Student wardrobe waste |
| `0:45 - 1:40` | **Scene 2: Landing Page & Design Aesthetics** | Brand identity, "Wear More. Waste Less.", Categories |
| `1:40 - 2:30` | **Scene 3: Authentication & Campus Profiles** | Secure JWT Auth, Campus verification, Profile stats |
| `2:30 - 3:45` | **Scene 4: Marketplace Discovery & Filtering** | Search, Multi-parameter filters, Dual listing types |
| `3:45 - 5:00` | **Scene 5: Item Details, Safety & Community Q&A** | High-res gallery, Campus note, Public Q&A subdocs |
| `5:00 - 6:15` | **Scene 6: Transaction & Campus Meetup Pass** | In-app trade proposal, Designated zones, Digital pass |
| `6:15 - 7:15` | **Scene 7: User Dashboard & Request Management** | My Listings, My Requests, Real-time status sync |
| `7:15 - 8:15` | **Scene 8: Admin Control Panel & Audit Telemetry** | Analytics charts (Recharts), Moderation, CSV export |
| `8:15 - 8:50` | **Scene 9: Deployment Architecture & Conclusion** | Vercel + Render + Atlas, Impact summary, Wrap-up |

---

## 📜 Scene-by-Scene Script & Action Guide

---

### Scene 1: Introduction & The Campus Problem
**Duration:** `0:00 - 0:45`  
**Screen Display:** Show the ReClothing Landing Page with full-screen view. Smooth slow scroll down the hero section.

#### 🎙️ Voiceover (Spoken Text):
> *"Hello everyone! Welcome to the demonstration of **ReClothing** — our campus thrift and circular clothing exchange marketplace developed for our College End-Term Capstone Project.*
>
> *Every semester, college students face a persistent dilemma: wardrobes overflowing with gently used clothes, winter coats, and course textbooks that go unused after just a few months. At the same time, buying brand-new apparel each semester strains student budgets, and fast fashion accounts for over 10% of global carbon emissions.*
>
> *Existing platforms like eBay or Poshmark charge 10 to 20 percent seller fees and require expensive shipping. Disorganized campus WhatsApp groups lose listings in chat history.*
>
> ***ReClothing** solves this with a dedicated, zero-commission, peer-to-peer campus platform under the motto: **'Wear More. Waste Less.'**"*

---

### Scene 2: Landing Page & Design Aesthetics
**Duration:** `0:45 - 1:40`  
**Screen Display:** Scroll through the Hero banner, Category navigation chips, Featured Listings grid, and Sustainability stats banner.

#### 🖥️ Visual Actions:
- Hover over the category chips (*Clothing, Shoes, Bags, Accessories, Books, Other*).
- Highlight the **"Wear More. Waste Less."** ethos.
- Point out the distinct badges: green **"For Exchange"** vs emerald **"For Sale"**.

#### 🎙️ Voiceover (Spoken Text):
> *"Here on the home page, you immediately notice our clean, editorial design crafted with Tailwind CSS and React. We prioritized a trustworthy, modern experience tailored specifically for student living.*
>
> *Students can browse by specific campus categories: from clothing and winter outerwear to footwear, backpacks, and academic textbooks.*
>
> *Notice our dual listing model: listings marked **'For Sale'** support direct cash or Venmo handoffs with zero platform fees, while listings marked **'For Exchange'** let students trade items directly without spending a single dollar.*
>
> *Let's log in to experience the full interactive workflow."*

---

### Scene 3: Secure Authentication & Student Profiles
**Duration:** `1:40 - 2:30`  
**Screen Display:** Click **Login** in the navigation bar. Show the Login form with the One-Click Demo Credentials widget.

#### 🖥️ Visual Actions:
- Click the quick-fill demo button for **Elena Rostova** (`elena@campus.edu`).
- Click **Sign In**.
- Show the success toast notification: *"Welcome back, Elena Rostova!"*.
- Click on the Profile dropdown and navigate to **Profile**.

#### 🎙️ Voiceover (Spoken Text):
> *"For authentication, ReClothing implements a production-grade security architecture using JSON Web Tokens stored in secure HTTP-only cookies, combined with an Authorization Bearer token fallback for cross-domain deployments.*
>
> *We've built in convenient one-click demo credentials so evaluators can test any role instantly. Let's sign in as Elena from Stanford University.*
>
> *On the profile page, every member is linked to their verified college institution. Here, students can manage their active campus listings, view trade history, and update their bio."*

---

### Scene 4: Marketplace Discovery & Granular Filtering
**Duration:** `2:30 - 3:45`  
**Screen Display:** Click **Explore Marketplace** in the top navigation.

#### 🖥️ Visual Actions:
- Type `"jacket"` into the live search input. Show instant filtered results.
- Clear search and apply filters:
  - Select Category: **Shoes** (shows Nike Air Force 1s and Dr. Martens boots).
  - Select Listing Type: **For Exchange** (shows items open for item swaps).
  - Toggle Condition: **Like New**.
- Change Sort by: **Price: Low to High**, then **Most Popular**.

#### 🎙️ Voiceover (Spoken Text):
> *"Now let's explore the central marketplace. In a campus environment, students need to find items quickly.*
>
> *Our search engine allows real-time keyword matching against item titles and descriptions. We can filter simultaneously by product category, item condition, size, and listing type.*
>
> *Notice our live popularity telemetry: each listing tracks genuine student view counts in MongoDB, surfacing trending campus pieces.*
>
> *Let's click on this vintage Levi's Trucker Jacket to see the detailed listing view."*

---

### Scene 5: Item Details, Campus Safety & Community Q&A
**Duration:** `3:45 - 5:00`  
**Screen Display:** Open the **Vintage Oversized Denim Trucker Jacket** page.

#### 🖥️ Visual Actions:
- Scroll through the high-resolution photo gallery.
- Highlight the **Campus Safety Note**: *"Requests signal intent to buy or trade. No online credit card transactions occur on ReClothing. Always meet peers in verified public campus areas."*
- Scroll to the **Community Questions & Answers** section.
- Type a quick question: *"Is the inner lining warm enough for winter?"* and submit.

#### 🎙️ Voiceover (Spoken Text):
> *"The listing page provides everything a buyer needs: high-resolution image galleries, exact size and condition badges, and transparent seller details.*
>
> *Crucially, ReClothing is engineered with campus safety as a first principle. Notice the campus disclaimer: we intentionally avoid high-fee third-party payment gateways. Instead, all transactions are coordinated for safe physical handoffs in verified public campus spots like student unions and campus libraries.*
>
> *Below the product, we built an interactive Community Q&A feature. Prospective buyers can ask public questions about fit or material, and sellers can answer directly, keeping all students informed."*

---

### Scene 6: Transaction Coordination & The Campus Meetup Pass
**Duration:** `5:00 - 6:15`  
**Screen Display:** Click the **Request to Buy / Trade** button. The Request Modal appears.

#### 🖥️ Visual Actions:
- Select a designated campus meetup zone from the dropdown (e.g., **Student Center Lobby**).
- Choose preferred meetup time: **Afternoon (1:00 PM - 5:00 PM)**.
- Type a friendly note: *"Can meet up right after my 2 PM CS lecture!"*
- Submit the request. Show the success notification.
- Open **My Requests** and demonstrate the **Campus Meetup Pass** modal.

#### 🎙️ Voiceover (Spoken Text):
> *"Now let's initiate a transaction. When requesting an item, the buyer selects a designated high-traffic campus pickup zone — such as the Student Center or the Library Plaza — along with their preferred time slot.*
>
> *Once both parties agree, ReClothing generates a unique **Campus Meetup Pass**. This serves as a digital receipt with the verified pickup location, agreed price, seller contact, and transaction ID.*
>
> *Simultaneously, the MongoDB database atomically updates the listing status to 'reserved', preventing duplicate offers from other students."*

---

### Scene 7: User Dashboard & Listing Management
**Duration:** `6:15 - 7:15`  
**Screen Display:** Navigate to **Create Listing** or **My Listings**.

#### 🖥️ Visual Actions:
- Show the **Create Listing** form: upload image URL, enter title, price, category, condition, and exchange preference.
- Show **My Listings** tab: Demonstrate toggles to edit details, mark an item as sold/exchanged, or delete.
- Briefly show the notification bell updating in real time.

#### 🎙️ Voiceover (Spoken Text):
> *"Listing an item takes less than a minute. Students can specify whether they want cash, a swap, or both, including their exact exchange wishlist.*
>
> *Through the user dashboard, sellers can manage their active inventory, monitor incoming buyer requests, and mark items as exchanged once the handshake is complete.*
>
> *Now, let's switch to the most powerful section of our application: the **Admin Control Panel**."*

---

### Scene 8: Admin Control Panel & Academic Telemetry
**Duration:** `7:15 - 8:15`  
**Screen Display:** Log out and log in with the administrator account (`sanskarbhanderi08@gmail.com`). Click **Admin Dashboard** in the navigation.

#### 🖥️ Visual Actions:
- Point out the Admin badge in the navbar.
- Show the summary stat cards: Total Listings, Active Items, Total Users, Trade Requests.
- Hover over the **Recharts Visualizations**: Category breakdown pie/bar charts.
- Scroll down to the **Moderation Suite**: show listing status toggling (Active / Reserved) and instant spam removal.
- Click **Export Platform Audit (CSV)**. Show the file download `ReClothing_Platform_Audit.csv`.

#### 🎙️ Voiceover (Spoken Text):
> *"ReClothing includes full Role-Based Access Control. As a designated Campus Administrator, a dedicated Admin Dashboard becomes accessible.*
>
> *Here, campus evaluators can view real-time platform telemetry computed via MongoDB aggregation pipelines — displaying total platform listings, active inventory, registered students, and category distributions visualised with Recharts.*
>
> *The administrator has a complete moderation suite to protect the campus community from spam or inappropriate listings.*
>
> *Furthermore, with one click on **'Export Platform Audit'**, the system generates a complete CSV report containing all system metadata, timestamps, and seller metrics for evaluation and auditing."*

---

### Scene 9: Cloud Deployment Architecture & Conclusion
**Duration:** `8:15 - 8:50`  
**Screen Display:** Show the final slide or browser tab showing the live Vercel URL and Render backend health endpoint (`/api/health`).

#### 🎙️ Voiceover (Spoken Text):
> *"In terms of architecture, ReClothing is fully cloud-deployed and production-ready:*
> - *Our **Frontend** is deployed on **Vercel** with optimized Vite asset bundling and Single Page Application rewrites.*
> - *Our **Backend API** runs as an Express microservice on **Render**.*
> - *Our **Database** is fully hosted on a managed **MongoDB Atlas** cloud cluster.*
>
> *By combining modern MERN stack architecture with sustainable campus circular economy principles, **ReClothing** demonstrates how software can empower university communities to save money, connect peers, and reduce textile waste.*
>
> *Thank you for your time, and we look forward to your questions and feedback!"*

---

## 💡 Top 5 Tips for a Flawless Recording
1. **Pacing:** Speak clearly at a moderate, confident pace. Don't rush through the visual transitions.
2. **Cursor Motion:** Avoid rapid, jerky mouse movements. Glide your cursor smoothly to the buttons you reference.
3. **Zoom & Pan (Optional):** If using OBS or Loom, zoom in slightly on toast messages and the Meetup Pass for maximum visual impact.
4. **Resolution:** Record at 1080p (1920x1080) at 60 FPS for crisp typography and smooth hover animations.
5. **Short Cuts:** If you stumble on a sentence, simply pause for 2 seconds and re-say that sentence — you can easily splice it out in video editing!
