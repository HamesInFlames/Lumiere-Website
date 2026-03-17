# Lumière Digital Platform - Full Roadmap

> Last updated: March 2026

## Vision

Transform Lumière Pâtisserie from a static website into a complete digital ecosystem:

```
┌─────────────────────────────────────────────────────────────────┐
│                    LUMIÈRE DIGITAL PLATFORM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   PUBLIC    │    │    STAFF    │    │      BACKEND        │ │
│  │   WEBSITE   │◄──►│ APPLICATION │◄──►│      SERVICES       │ │
│  │  (React)    │    │(React Native│    │  (API + Database)   │ │
│  │             │    │   + Expo)   │    │                     │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│        │                  │                      │              │
│        ▼                  ▼                      ▼              │
│  • Menu/Products    • Team Chat           • User Auth          │
│  • Contact          • Pre-orders          • Real-time Chat     │
│  • Pre-order Form   • Wholesales          • Product Data       │
│  • Checkout (later) • Calendar            • Inventory          │
│  • Gift Cards       • Inventory           • Orders             │
│  • Membership       • Role-based Access   • Notifications      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Milestone Overview

| # | Milestone | Status | Complexity |
|---|-----------|--------|------------|
| 1 | Public Website | DONE | - |
| 2 | Staff Application | Next | High |
| 3 | Inventory System | Planned | Medium |
| 4 | Checkout System (Pre-orders) | Planned | Medium |
| 5 | Payment Integration | Planned | Medium-High |
| 6 | Gift Cards & Membership | Planned | Medium |

---

## Milestone 1: Public Website (DONE)

**Current state**: Deployed on Railway, CSV-based products, Google Apps Script contact form.

**Pending improvements** (can be done in parallel with Milestone 2):
- Fix minor bugs (typos, E-Boutique label)
- Add SEO meta tags
- Clean up legacy code folders
- Centralize configuration

---

## Milestone 2: Staff Application

### Purpose

Replace WhatsApp for internal communication with a dedicated app that includes:
- **Team Chat** (channels like "Official", "Bar Team", "Kitchen")
- **Pre-order Management** (create, view, mark complete)
- **Wholesale Management** (recurring customers, orders)
- **Calendar** (view pre-orders and wholesales by date)
- **Role-based Access** (Owner, Kitchen, Bar Staff)

### Company Structure

```
┌─────────────────────────────────────────┐
│                 OWNER                   │
│         (Full access to everything)     │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┴───────────┐
     ▼                       ▼
┌─────────────┐       ┌─────────────┐
│   KITCHEN   │       │  BAR STAFF  │
│ (Baker,     │       │ (Baristas)  │
│  Pastry     │       │             │
│  Chefs)     │       │             │
└─────────────┘       └─────────────┘
```

### Chat Channels

| Channel | Access | Purpose |
|---------|--------|---------|
| LUMIERE OFFICIAL | All staff | Pre-orders, Wholesales, Announcements |
| Lumiere Bar Team | Bar Staff + Owner | Bar-specific communication |
| Kitchen | Kitchen + Owner | Kitchen-specific communication |

### Pre-order Data Structure

```
Pre-order:
├── type: "preorder" | "wholesale"
├── status: "pending" | "in-progress" | "ready" | "completed"
├── paid: boolean
├── pickupDate: Date
├── customerName: string
├── items: [
│     { product: "Chocohazelnut", quantity: 1, customization: "Happy Birthday Thomas" }
│   ]
├── notes: "For Matthew"
├── createdBy: User (Bar/Owner)
├── createdAt: timestamp
└── assignedTo: "kitchen" | "bar" (who prepares it)

Wholesale:
├── customer: "C-C" | etc. (recurring account)
├── deliveryDate: Date
├── kitchen that is preparing the order: [
│     { name: "LUMIERE", items: [...] },
│     { name: "TOVA", items: [...] }
│   ]
├── status: "pending" | "preparing" | "prepared" | "delivered / picked up"
└── createdBy: User
```

### Technology Stack

**Mobile App**: React Native + Expo
- Uses React (familiar technology)
- Single codebase for iOS and Android
- Free testing via Expo Go app

**Backend**: Node.js + Express + Socket.io
- Real-time chat capabilities
- RESTful API for orders, users, etc.

**Database**: MongoDB Atlas (free tier)
- 512MB storage, sufficient for ~20 users
- Mongoose ODM

**Push Notifications**: Expo Push Notifications (free)

**Authentication**: JWT tokens
- Email/password for staff
- Owner creates accounts for team members

### Repository Structure (Monorepo)

```
Lumiere-Website/
├── apps/
│   ├── web/              # Current website (move src/ here)
│   └── staff/            # React Native Expo app
├── packages/
│   └── shared/           # Shared types, utilities
├── backend/              # Revived and expanded API
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── controllers/
│   │   └── socket/       # Real-time chat
│   └── package.json
├── public/               # Website public assets
└── package.json          # Workspace root
```

### Staff App Features (MVP)

1. **Authentication**
   - Login screen
   - Role assigned by owner when creating account

2. **Chat**
   - Channel list (based on role access)
   - Real-time messaging
   - Push notifications for new messages

3. **Orders**
   - Create pre-order (Bar/Owner)
   - Create wholesale order (Owner)
   - View orders list (filtered by role)
   - Mark order status

4. **Calendar**
   - Month/week view
   - Shows pre-orders and wholesales by pickup/delivery date
   - Tap to view details

---

## Milestone 3: Inventory System

### Purpose

Track stock levels for:
- **Finished products** (cakes, pastries in display)
- **Ingredients** (flour, chocolate, cream, etc.)

### Features

- Add/remove stock
- Low stock alerts (push notification)
- Usage tracking (link to orders)
- Inventory reports

### Integration

- Links to Staff App (kitchen updates stock)
- Links to Checkout (reduce stock on sale)

---

## Milestone 4: Checkout System (Pre-orders, No Payment)

### Purpose

Allow customers to place pre-orders through the website (replacing phone calls).

### Phase 1: No Payment

- Customer fills form: items, pickup date, contact info
- Order appears in Staff App
- Staff confirms via phone/email
- Customer pays on pickup

### Integration

- Website: New `/preorder` page
- Staff App: Pre-orders appear automatically
- Calendar: Auto-populated

---

## Milestone 5: Payment Integration

### Purpose

Accept online payments for pre-orders.

### Technology

- **Stripe** (industry standard, good docs)
- Or **Square** (if already using Square POS in store)

### Features

- Pay online when ordering
- Pay deposit (e.g., 50% now, rest on pickup)
- Refund handling

---

## Milestone 6: Gift Cards & Membership

### Gift Cards

- Purchase digital gift cards
- Unique codes
- Redeem online or in-store

### Membership

- Loyalty points system
- Member discounts
- Birthday rewards

---

## Technical Architecture (Full System)

```
┌──────────────────────────────────────────────────────────────────────┐
│                           FRONTEND APPS                              │
├────────────────────────────┬─────────────────────────────────────────┤
│      Public Website        │           Staff Mobile App              │
│      (React + Vite)        │         (React Native + Expo)           │
│                            │                                         │
│  • Menu browsing           │  • Team chat (real-time)                │
│  • Contact form            │  • Pre-order management                 │
│  • Pre-order form (M4)     │  • Wholesale management                 │
│  • Checkout (M5)           │  • Calendar view                        │
│  • Gift cards (M6)         │  • Inventory updates (M3)               │
│  • Membership (M6)         │  • Push notifications                   │
└────────────────────────────┴─────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                           BACKEND API                                │
│                    (Node.js + Express + Socket.io)                   │
├──────────────────────────────────────────────────────────────────────┤
│  /api/auth         - Login, register, JWT tokens                     │
│  /api/users        - Staff management (owner only)                   │
│  /api/chat         - Channels, messages                              │
│  /api/orders       - Pre-orders, wholesales                          │
│  /api/products     - Product catalog (replaces CSV eventually)       │
│  /api/inventory    - Stock levels (M3)                               │
│  /api/payments     - Stripe integration (M5)                         │
│  /api/giftcards    - Gift card codes (M6)                            │
│  /api/membership   - Loyalty program (M6)                            │
│                                                                      │
│  Socket.io: Real-time chat, order updates, notifications             │
└──────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                           DATABASE                                   │
│                      (MongoDB Atlas - Free Tier)                     │
├──────────────────────────────────────────────────────────────────────┤
│  Collections:                                                        │
│  • users          - Staff accounts, roles                            │
│  • channels       - Chat channels                                    │
│  • messages       - Chat messages                                    │
│  • orders         - Pre-orders and wholesales                        │
│  • products       - Product catalog                                  │
│  • inventory      - Stock levels                                     │
│  • customers      - Customer accounts (M4+)                          │
│  • giftcards      - Gift card codes and balances (M6)                │
│  • memberships    - Loyalty accounts (M6)                            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Strategy

| Component | Platform | Cost |
|-----------|----------|------|
| Website | Railway (current) | Free tier |
| Backend API | Railway | Free tier (500 hrs/month) |
| Database | MongoDB Atlas | Free tier (512MB) |
| Staff App | Expo (development) | Free |
| Staff App | App Store / Play Store (production) | $99/yr Apple, $25 once Google |

---

## Development Order

### Phase 1: Foundation
1. Fix website bugs (parallel with planning)
2. Set up monorepo structure
3. Set up MongoDB Atlas
4. Build backend auth + user management

### Phase 2: Staff App MVP
5. Build React Native app shell (Expo)
6. Implement authentication flow
7. Build chat system (channels + real-time)
8. Build order creation (pre-orders, wholesales)
9. Build calendar view
10. Add push notifications

### Phase 3: Post-MVP
11. Inventory system
12. Website pre-order form
13. Payment integration
14. Gift cards & membership

---

## Risks & Considerations

| Risk | Mitigation |
|------|------------|
| React Native learning curve | Expo simplifies a lot; React knowledge transfers |
| Real-time complexity | Socket.io is well-documented; start simple |
| App Store approval | Use Expo for testing; submit when polished |
| Free tier limits | MongoDB 512MB is plenty for text data; monitor usage |
| Single developer | Focus on MVP features; avoid scope creep |

---

## Questions to Resolve Later

1. Should wholesale customers (TOVA, C-C) have their own login to place orders?
2. Do you want the calendar to sync with Google Calendar?
3. Should inventory alerts go to specific roles or everyone?
4. For membership, what rewards structure do you envision?
