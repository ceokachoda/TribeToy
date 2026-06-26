# TribeToy Admin Dashboard - File Structure

The new admin features are integrated into the existing Next.js App Router structure under `src/app/admin/`.

```text
src/
├── app/
│   ├── admin/                 # Protected Admin Routes
│   │   ├── layout.tsx         # Admin layout (sidebar, header, role guard)
│   │   ├── page.tsx           # Dashboard / Analytics
│   │   ├── products/          # Enhanced Product CRUD
│   │   ├── orders/            # Order Management (Guarded lifecycle)
│   │   ├── customers/         # Customer List & Details (PII masked)
│   │   ├── inventory/         # Stock Levels & Adjustments
│   │   ├── shipments/         # Shipping Labels & Logistics
│   │   ├── audit/             # Audit Logs
│   │   └── settings/          # Advanced Settings (Webhooks, CSV imports)
│   └── ...                    # Existing routes (login, products, etc.)
├── components/
│   ├── admin/                 # Admin-specific components
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── Header.tsx         # Top bar with alerts/profile
│   │   ├── charts/            # Recharts components
│   │   ├── ui/                # Admin UI primitives (buttons, tables, inputs)
│   │   └── ...
│   └── ...                    # Existing components
├── utils/
│   ├── supabase/              # Supabase clients (client/server/middleware)
│   └── admin/                 # Admin utilities (formatting, validators, pdf)
└── ...
```
