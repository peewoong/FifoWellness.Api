⛏️ FIFO Worker Wellness API
Optimizing Health & Fatigue Management for Australia's Industrial Workforce
This is a professional backend service built with ASP.NET Core 9.0, specifically designed for workers in Australia's Fly-In Fly-Out (FIFO) sector. The project focuses on tracking daily health metrics like sleep duration and calorie intake to prevent fatigue-related incidents in high-pressure mining environments.


🌟 Background & Motivation
Drawing from my personal experience in the FIFO utility sector in Darwin, I identified a need for a streamlined system to monitor worker well-being. This API serves as a foundation for a wellness platform that helps workers manage their health across demanding Day/Night shift rotations.


🚀 Tech Stack
Framework: .NET 9.0 (ASP.NET Core Web API)
Language: C#
Database: SQLite (Lightweight & Portable)
ORM: Entity Framework Core
Documentation: Scalar API Reference (OpenAPI)


🛠️ Key Features
1. Daily Wellness Tracking
WellnessLog Entity: Stores essential data points including WorkerName, ShiftType, SleepHours, and CalorieIntake.
Asynchronous Operations: Implemented async/await patterns for efficient data handling.

2. Industry-Specific Logic (Planned)
Fatigue Alert System: Logic to flag logs with insufficient sleep (under 6 hours).
Shift-Based Recommendations: Tailored nutritional goals based on Day or Night shift schedules.


📂 Project Structure & Conventions
Professional Naming: Followed the Project.Namespace convention (e.g., FifoWellness.Api).
Database Migrations: Utilized EF Core Code-First migrations for version-controlled schema management.
Clean API Design: Adheres to RESTful principles and standard HTTP status codes (e.g., 201 Created).
