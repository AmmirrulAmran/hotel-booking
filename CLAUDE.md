# Hotel Booking System

## 1. Project Overview

Build a full-stack **Hotel Booking System** using:

- **Frontend:** React + JavaScript
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **API:** REST
- **Authentication:** JWT or session-based authentication
- **Architecture:** Frontend → Express API → Service/Domain Layer → PostgreSQL
- **Programming paradigm:** Object-Oriented Programming (OOP) where appropriate

The purpose of this project is not simply to create a hotel booking application. It is primarily a **learning project for mastering JavaScript, React, Express, backend architecture, databases, REST APIs, and OOP**.

The application should gradually become more complex as features are added.

---

# 2. Learning Goals

The project should help me become comfortable with:

### JavaScript

- Objects
- Arrays
- `map()`
- `filter()`
- `reduce()`
- Destructuring
- Spread/rest operators
- Modules
- Promises
- `async` / `await`
- Error handling
- Classes
- Constructors
- Methods
- Encapsulation
- Composition
- Basic inheritance and polymorphism

### React

- Components
- Props
- State
- `useState`
- `useEffect`
- Forms
- Controlled inputs
- Event handling
- Conditional rendering
- Lists and keys
- Lifting state
- Derived state
- API requests
- Loading/error states
- Custom hooks
- Frontend routing

### Express

- Routes
- Controllers
- Middleware
- Request/response
- Route parameters
- Query parameters
- Request bodies
- HTTP status codes
- Validation
- Error-handling middleware
- Authentication middleware
- Authorization
- REST API design

### Backend Architecture

Learn to separate:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Domain / Business Logic
  ↓
Database
```

The controller should not contain all of the business logic.

### Database

Learn:

- Tables
- Primary keys
- Foreign keys
- Relationships
- One-to-many relationships
- Queries
- Joins
- Constraints
- Indexes
- Transactions
- Database validation

---

# 3. Core Application

The application represents a small hotel that allows customers to search for rooms and make reservations.

There are two main types of users:

```text
Customer
Admin
```

## Customer capabilities

A customer can:

- Register
- Log in
- View available rooms
- Search rooms
- Filter rooms
- View room details
- Select check-in/check-out dates
- Select number of guests
- Make a booking
- View their bookings
- Cancel eligible bookings

## Admin capabilities

An admin can:

- View all rooms
- Create rooms
- Edit rooms
- Disable rooms
- View all bookings
- Change booking status
- View customers
- Manage hotel inventory

---

# 4. Main Domain Objects

The application should use OOP for important domain concepts.

## User

Possible properties:

```text
id
name
email
passwordHash
role
createdAt
```

Possible behavior:

```text
canManageHotel()
canCancelBooking()
```

---

## Room

Possible properties:

```text
id
roomNumber
type
pricePerNight
capacity
status
```

Possible behavior:

```text
calculatePrice(nights)
canAccommodate(guests)
isAvailable()
```

Example:

```js
const room = new Room(
  101,
  "Deluxe",
  180,
  2
);

room.calculatePrice(3);
// 540
```

---

## Booking

Possible properties:

```text
id
user
room
checkIn
checkOut
guests
status
totalPrice
createdAt
```

Possible behavior:

```text
calculateNights()
calculateTotal()
confirm()
cancel()
complete()
```

Booking should enforce its own valid state transitions where appropriate.

Example:

```text
PENDING
   ↓
CONFIRMED
   ↓
COMPLETED

PENDING
   ↓
CANCELLED

CONFIRMED
   ↓
CANCELLED
```

Invalid transitions should be rejected.

For example:

```text
COMPLETED → PENDING
```

should not be allowed.

---

# 5. Important Business Logic

The main learning value of this project should come from the business rules.

## Room availability

When a customer searches for:

```text
Check-in:  10 Oct
Check-out: 13 Oct
```

the backend must determine which rooms are actually available.

A room is unavailable if an existing booking overlaps the requested period.

Example:

```text
Existing booking:
10 Oct ───────── 13 Oct

Requested booking:
12 Oct ───────── 15 Oct

Result:
CONFLICT
```

But:

```text
Existing:
10 Oct ───────── 13 Oct

Requested:
13 Oct ───────── 15 Oct

Result:
Potentially available
```

Use a clearly defined check-in/check-out convention.

The availability calculation must happen on the backend.

---

# 6. Price Calculation

If a room costs:

```text
RM180/night
```

and the customer books:

```text
10 Oct → 13 Oct
```

then:

```text
3 nights × RM180
= RM540
```

The backend must calculate the final price.

Do not trust a price supplied by the frontend.

The frontend can display an estimated price, but the server must recalculate it before creating the booking.

---

# 7. Booking Validation

When creating a booking, the backend should validate:

```text
Does the user exist?
        ↓
Does the room exist?
        ↓
Are the dates valid?
        ↓
Is check-out after check-in?
        ↓
Is the guest count valid?
        ↓
Does the room have enough capacity?
        ↓
Is the room available?
        ↓
Calculate number of nights
        ↓
Calculate total price
        ↓
Create booking
```

Return appropriate HTTP status codes.

Examples:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

# 8. Database Design

Start with these tables:

```text
users
rooms
bookings
```

## users

```text
id
name
email
password_hash
role
created_at
```

## rooms

```text
id
room_number
type
price_per_night
capacity
status
created_at
```

## bookings

```text
id
user_id
room_id
check_in
check_out
guests
total_price
status
created_at
```

Relationships:

```text
User
  │
  └──────< Booking >────── Room
```

One user can have many bookings.

One room can have many bookings over time.

---

# 9. REST API

Initial API:

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Rooms

```http
GET    /api/rooms
GET    /api/rooms/:id
POST   /api/rooms
PATCH  /api/rooms/:id
DELETE /api/rooms/:id
```

## Availability

```http
GET /api/rooms/available
```

Example:

```http
GET /api/rooms/available?checkIn=2026-10-10&checkOut=2026-10-13&guests=2
```

## Bookings

```http
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PATCH  /api/bookings/:id
DELETE /api/bookings/:id
```

Authorization rules must determine which user can access each booking.

---

# 10. React Application

Suggested pages:

```text
/
├── Home
├── Rooms
├── RoomDetails
├── Booking
├── MyBookings
├── Login
├── Register
├── Profile
└── AdminDashboard
```

Suggested components:

```text
RoomCard
RoomList
SearchForm
DatePicker
BookingSummary
BookingCard
Navbar
Modal
LoadingSpinner
ErrorMessage
```

---

# 11. React State

The booking interface should require meaningful state management.

For example:

```text
selectedRoom
checkIn
checkOut
guests
loading
error
bookingStatus
```

The frontend should handle:

```text
Loading
Success
Error
Empty results
Invalid input
Booking conflict
```

Avoid putting everything into one giant component.

Break logic into appropriate components and custom hooks where useful.

---

# 12. Search and Filtering

The room search should support:

```text
Check-in
Check-out
Number of guests
Room type
Maximum price
```

Example:

```http
GET /api/rooms/available
    ?checkIn=2026-10-10
    &checkOut=2026-10-13
    &guests=2
    &type=deluxe
```

The frontend should display only the rooms returned by the backend.

---

# 13. Authentication and Authorization

Users should log in before making bookings.

Roles:

```text
CUSTOMER
ADMIN
```

Customer:

```text
Create booking
View own bookings
Cancel eligible bookings
```

Admin:

```text
Manage rooms
View all bookings
Manage booking status
```

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Make sure these concepts are explained separately when teaching me.

---

# 14. Admin Dashboard

Create an admin dashboard with:

```text
Rooms
Bookings
Users
```

Example:

```text
Rooms

Room 101   Deluxe   RM180   Available
Room 102   Deluxe   RM180   Maintenance
Room 103   Family   RM250   Available
```

Admin should be able to:

```text
Create room
Edit room
Disable room
View bookings
Change booking status
```

---

# 15. Advanced Features

Once the core system works, gradually add:

### Pagination

```http
GET /api/bookings?page=2&limit=20
```

### Sorting

```http
GET /api/rooms?sort=price_asc
```

### Searching

```http
GET /api/rooms?type=deluxe
```

### Cancellation rules

Example:

```text
More than 48 hours before check-in
→ cancellation allowed

Less than 48 hours
→ cancellation rejected
```

### Booking history

Users should be able to see:

```text
Upcoming
Completed
Cancelled
```

---

# 16. OOP Requirements

Do not use OOP just for the sake of using classes.

Use classes where they naturally represent domain entities or behavior.

Potential classes:

```text
User
Room
Booking
Hotel
Payment
```

The project should demonstrate:

### Classes

```js
class Room {
  ...
}
```

### Constructors

```js
constructor(...)
```

### Instance properties

```js
this.price
this.capacity
```

### Methods

```js
calculatePrice()
canAccommodate()
```

### Encapsulation

Business rules should be kept close to the objects/services responsible for them.

### Composition

Prefer combining objects when appropriate.

For example:

```text
Booking
 ├── User
 └── Room
```

### Inheritance

Use inheritance only where there is a genuine "is-a" relationship.

Do not create artificial class hierarchies simply to demonstrate inheritance.

---

# 17. Architecture

Aim for:

```text
React
   │
   │ HTTP / JSON
   ▼
Express Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Domain Objects
   │
   ▼
Database
```

Example:

```text
POST /api/bookings
        ↓
bookingRoutes.js
        ↓
bookingController.js
        ↓
bookingService.js
        ↓
Booking / Room domain logic
        ↓
PostgreSQL
```

The controller should mainly deal with HTTP concerns.

Business rules should live in services/domain logic rather than being scattered throughout routes.

---

# 18. Project Development Order

Do not build everything at once.

Build progressively:

## Phase 1

Basic React interface.

```text
Rooms
Room details
Booking form
```

Use fake data.

## Phase 2

Express API.

Implement:

```text
GET rooms
GET room
POST booking
GET bookings
```

## Phase 3

PostgreSQL.

Replace fake data with real database data.

## Phase 4

Business logic.

Implement:

```text
Date validation
Room availability
Price calculation
Booking conflicts
```

## Phase 5

Authentication.

Implement:

```text
Register
Login
Logout
Current user
```

## Phase 6

Authorization.

Implement:

```text
Customer
Admin
```

## Phase 7

Admin dashboard.

## Phase 8

Advanced features.

```text
Pagination
Filtering
Sorting
Cancellation rules
Booking state machine
```

---

# 19. How Claude Should Teach Me

I am using this project primarily to **learn**, not just to produce a working application.

When I ask about something, explain it in a beginner-friendly way.

Prefer:

```text
Concept
↓
Why it exists
↓
Simple example
↓
How it applies to this project
↓
Code
↓
Trace through the code
```

For example, if explaining middleware:

```text
Request
   ↓
Middleware
   ↓
Controller
   ↓
Response
```

Then explain what each stage does.

Do not assume I already understand advanced backend architecture.

---

# 20. Don't Over-Abstract

Avoid creating unnecessary abstractions such as:

```text
BaseController
AbstractRepository
GenericServiceFactory
GenericEntityManager
```

unless there is a genuine reason.

The purpose of the project is to understand the architecture, not to create the most abstract architecture possible.

Prefer straightforward code that clearly demonstrates the concept.

---

# 21. When I Ask "Why?"

Explain the underlying reasoning.

For example, don't just say:

> "Put this in a service."

Explain:

> "The controller receives the HTTP request, but checking room availability is business logic. Keeping it in a service means the same booking logic can later be reused by another route or background process."

Focus on **why the design exists**, not just where the code goes.

---

# 22. When I Ask About Code

Explain unfamiliar syntax before relying on it.

For example:

```js
expenses.reduce(
  (sum, expense) => sum + expense.amount,
  0
);
```

Explain:

```text
reduce()
↓
callback
↓
sum
↓
expense
↓
initial value = 0
```

Do not assume that I understand JavaScript methods just because I can read the syntax.

---

# 23. Avoid Giving Too Much Code

When I ask to understand a concept, show the smallest useful example.

Do not dump entire files unless I specifically ask for the complete implementation.

I want to understand the code rather than blindly copy it.

---

# 24. Important Learning Principle

The project should gradually move from:

```text
Simple CRUD
```

to:

```text
CRUD
 ↓
Validation
 ↓
Business Logic
 ↓
Relationships
 ↓
Authentication
 ↓
Authorization
 ↓
Transactions
 ↓
Concurrency
 ↓
Architecture
```

The goal is to reach the point where I can independently design and build a full-stack application rather than simply reproduce tutorial code.

---

# 25. Definition of Done

The project is considered complete when:

### Frontend

- React application works
- Authentication works
- Room search works
- Availability works
- Booking flow works
- Booking history works
- Admin dashboard works
- Loading/error states are handled

### Backend

- REST API works
- Authentication works
- Authorization works
- Validation exists
- Error handling exists
- Business logic is separated from controllers
- Booking conflicts are prevented
- Price is calculated server-side

### Database

- PostgreSQL is used
- Relationships are implemented
- Constraints are used where appropriate
- Queries are understood
- Transactions are used where appropriate

### OOP

- Classes are used for meaningful domain concepts
- Methods contain relevant behavior
- Composition is demonstrated
- Encapsulation is demonstrated
- Inheritance/polymorphism is used only when justified

---

# 26. Main Goal

The final application is **not the main goal**.

The main goal is to become comfortable thinking through:

```text
User action
     ↓
React state
     ↓
HTTP request
     ↓
Express route
     ↓
Middleware
     ↓
Controller
     ↓
Business logic
     ↓
Database
     ↓
Response
     ↓
React state update
     ↓
UI
```

By the end of the project, I should be able to look at a feature and reason about the entire flow from **frontend → backend → database → frontend**.
