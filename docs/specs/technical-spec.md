# Technical Specification

## Non-Functional Requirements

- **0:** Response time < 200ms for auth endpoints
- **1:** Support 10,000 concurrent sessions
- **2:** 99.9% uptime SLA
- **3:** Password hashing with bcrypt cost factor 12
- **4:** All data encrypted at rest with AES-256
- **5:** TLS 1.3 for all communications
