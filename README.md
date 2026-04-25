# SmartSeason - Agricultural Monitoring System
Built by Sammy Kiprop for the Shamba Records Engineering Internship Assessment.

## 🚀 Live Demo Links
- **Frontend (Live):** (https://smartseasonfnd.vercel.app/)
- **Backend API (Live):** (https://smartseasonbnd.onrender.com)

## 🔐 Demo Credentials
- **Admin Login:** username: `admin_user`, password: `password123`
- **Agent Login:** username: `agent_user`, password: `password123`

## 🏗️ Architecture & Design Decisions
1. **Clean Separation of Concerns:** The React frontend utilizes distinct page routes (`/admin/dashboard` vs `/agent/dashboard`) rather than complex conditional rendering. This prevents the Agent bundle from being bloated with Admin logic and ensures secure role-based access.
2. **Schema Alignment:** Strict parity was maintained between the frontend React payload and the backend Django DRF serializers (e.g., `stage_at_update`) to prevent malformed data.
3. **Graceful Degradation:** The UI incorporates comprehensive `isLoading` states, `error` boundaries, and empty fallbacks to ensure a premium HCI (Human-Computer Interaction) experience even on slow networks.