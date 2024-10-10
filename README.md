# 🚀 API Rate Limiter for SMS APIs with React Dashboard

This project provides a robust API rate limiting solution for SMS services, featuring a React-based dashboard for real-time monitoring of SMS usage and rate limit violations.

https://github.com/user-attachments/assets/a755a151-7cb8-4fd4-b1f1-dc13d276fd48

## 🗂️ Table of Contents

- [📷 Screenshots](#screenshots)
- [🛠️ Technologies Used](#technologies-used)
- [📝 Task Overview](#task-overview)
- [⚙️ How to Run the Project Locally](#how-to-run-the-project-locally)
- [📡 API Usage](#api-usage)
- [📁 Folder Structure](#folder-structure)
- [📧 Contact](#contact)

## 📷 Screenshots

<table>
  <tr>
    <td>
      <img src="https://github.com/suryanshsingh2001/Zemetric/blob/main/showcase/dashboard.png" alt="Dashboard" width="400"/><br/>
      <p style="text-align:center;">Dashboard</p>
    </td>
    <td>
      <img src="https://github.com/suryanshsingh2001/Zemetric/blob/main/showcase/sendsms.png" alt="Send SMS" width="400"/><br/>
      <p style="text-align:center;">Send SMS</p>
    </td>
  </tr>
  <tr>
     <td>
      <img src="https://github.com/suryanshsingh2001/Zemetric/blob/main/showcase/violations.png" alt="Violation" width="400"/><br/>
      <p style="text-align:center;">Violations Page</p>
    </td>
    <td>
      <img src="https://github.com/suryanshsingh2001/Zemetric/blob/main/showcase/logs.png" alt="Logs Page" width="400"/><br/>
      <p style="text-align:center;">Logs Page</p>
    </td>
   
  </tr>
</table>

## 🛠️ Technologies Used

- **Backend**: Node.js (Express, TypeScript)
- **Frontend**: React (TypeScript, Vite), Shadcn UI, Tailwind CSS
- **Storage**: Redis for rate-limiting persistence
- **Visualization**: Recharts, Shadcncharts
- **Validation**: Zod
- **HTTP Client**: Axios
- **Logging**: Winston

## 📝 Task Overview

Here's an overview of how each functional and non-functional requirement was addressed:

### Functional Requirements

- [x] **Rate Limiting**: Used Redis to store rate limit counters keyed by both IP address and phone number.
- [x] **Throttling**: Responded with `429 Too Many Requests` status and `Retry-After` header.

### Non-Functional Requirements

- [x] **Persistent Storage**: Redis TTL was configured for minute and day-based limits.
- [x] **Logging**: Structured logging with Winston to capture request info and violations.
- [x] **Error Handling**: Error middleware handles invalid requests and returns appropriate responses (`400`, `500`).

---

### 🎉 Additional Features

1. **📜 Dedicated Logs Page**:

   - View all logs, filter logs by type, and sort by timestamp.
   - Access logs in `backend/logs`.

2. **⛔ Violation List Page**:

   - Displays all rate limit violations with timestamps.

3. **📊 Chart System**:
   - Intuitive charts visualize SMS sent per minute and per day using Recharts and Shadcncharts.

---

## ⚙️ How to Run the Project Locally

**Quick Note**: Run backend and frontend separately in different terminals.

### 🔧 For Backend

1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Make sure Redis is installed and running on your machine. You can use Docker to run Redis with:
   ```bash
   docker run -p 6379:6379 redis
   ```
4. Run `npm start` to start the backend server. The server will be available on `http://localhost:3000` and will connect to Redis with:
   ```bash
   Connected to Redis server
   Redis is connected and responding:PONG
   ```

### 🖥️ For Frontend

1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the frontend server on `http://localhost:5173`.
4. Open `http://localhost:5173` in your browser to view the dashboard.

---

## 📡 API Usage

**Note**: IP address is taken from the request.

### 1. 📤 Send SMS

**Endpoint**: `/api/sms/send`  
**Method**: `POST`  
**Description**: Sends an SMS message to a specified phone number. Rate limits are applied based on IP and phone number.

**Request Body**:

```json
{
  "phoneNumber": "string",
  "message": "string"
}
```

**Response**:

- **Success**: `200 OK`
  ```json
  {
    "status": "success",
    "message": "SMS sent successfully"
  }
  ```
- **Rate Limit Exceeded**: `429 Too Many Requests`
  ```json
  {
    "status": "error",
    "message": "Rate limit exceeded. Try again in X seconds.",
    "retryAfter": "X seconds"
  }
  ```
  - Headers:  
    `Retry-After: <X seconds>`

### 2. 📊 Get SMS Usage Stats

**Endpoint**: `/api/stats/usage`  
**Method**: `GET`  
**Description**: Retrieves SMS usage stats and rate limit violations for a given phone number.

**Query Parameters**:

- `phoneNumber`: The phone number for which to retrieve SMS usage stats.

**Response**:

```json
{
  "smsSentLastMinute": 3,
  "smsSentToday": 10,
  "violations": 2
}
```

### 3. 📄 Get Rate Limit Violations

**Endpoint**: `/api/stats/violations`  
**Method**: `GET`  
**Description**: Retrieves the rate limit violation messages that occurred in the last hour.

**Response**:

```json
{
  "violations": [
    {
      "ip": ":1",
      "message": "Daily limit exceeded. Try again in X hours"
    },
    {
      "ip": ":1",
      "message": "Minute limit exceeded. Try again in X seconds"
    }
  ]
}
```

### 4. 📜 Get All Logs

**Endpoint**: `/api/logs`  
**Method**: `GET`  
**Description**: Retrieves all logs along with their response data in JSON format. You can view them in the Logs page in the React dashboard.

**Response**:

```json
{
  "logs": [
    {
      "timestamp": "2021-10-10T12:00:00.000Z",
      "level": "info",
      "message": "SMS sent successfully",
      "data": {
        "phoneNumber": "1234567890",
        "message": "Hello, world!"
      }
    },
    {
      "timestamp": "2021-10-10T12:00:00.000Z",
      "level": "error",
      "message": "Rate limit exceeded",
      "data": {
        "phoneNumber": "1234567890",
        "message": "Hello, world!"
      }
    }
  ]
}
```

---

## 📁 Folder Structure

### Backend

```
backend/
├── logs                   # Log files
├── src
│   ├── controllers         # Request handlers
│   ├── middlewares         # Middleware functions
│   ├── config              # Redis configurations
│   ├── routes              # API routes
├── app.ts                  # Server entry point
```

### Frontend

```
frontend/
  ├── src/
  │   ├── components
  │   ├── pages
  │   ├── lib
  │   ├── zod
  │   App.tsx
  │   main.tsx
      config.ts
  ├── types/
  ├── public/
```

---

## 📧 Contact

- **Email**: [tashusingh2001@gmail.com](mailto:tashusingh2001@gmail.com)
- **LinkedIn**: [Suryansh Singh](https://www.linkedin.com/in/suryanshsingh2001/)
- **GitHub**: [@suryanshsingh2001](https://github.com/suryanshsingh2001)
