# API Rate Limiter for SMS APIs with React Dashboard

## Technologies Used

- Backend: Node.js (Express) with TypeScript
- Frontend: React (TypeScript, Vite), Shadcn UI, Taildwind CSS
- Storage: Redis (for rate-limiting persistence)
- Logging: Winston (for structured logging)
- HTTP Client: Axios (for making API requests in the React dashboard)

## Task Overview

Here's an overview of how each requirement was addressed, along with additional features implemented:

### 1. Rate Limiting

- [x] Used Redis to store rate limit counters keyed by both IP address and phone number.
- [x] Applied middleware to check rate limits on each request.
- [x] Configured Redis TTL for minute and day-based tracking.

### 2. Throttling

- [x] Responded with a `429 Too Many Requests` status when limits are exceeded.
- [x] Added `Retry-After` header in responses to inform clients when to retry.

### 3. Persistent Storage

- [x] Used Redis for persistent storage of rate limit data across API instances.
- [x] Configured Redis to use TTL to expire keys appropriately for daily and minute-based limits.

### 4. Logging

- [x] Implemented structured logging using Winston.
- [x] Captured IP address, phone number, request time, and rate limit violations in logs.

### 5. Error Handling

- [x] Added error-handling middleware for invalid requests.
- [x] Returned appropriate error responses (`400 Bad Request`, `500 Internal Server Error`).

### 6. React Dashboard

- [x] Developed SMS usage statistics display (SMS sent in the last minute and today).
- [x] Created rate limit violation logs display for the last hour.
- [x] Built a dedicated page for sending SMS messages with response status view displayed.

---

### Bonus Features Implemented

### 1. Dedicated Logs Page

- [x] Added a page to display all logs along with their response data in JSON with the ability to:
  - Filter logs by type (e.g., info, error).
  - Sort logs by timestamp.
  - Access the `app.log` file in `backend/logs` to view logs file directly.

### 2. Violation List Page

- [x] Created a dedicated page that shows all rate limit violations along with timestamps.

### 3. Chart System in Dashboard

- [x] Integrated a chart system using `recharts` and `shadcncharts` for a more intuitive view of SMS statistics.
- [x] Visualized SMS sent per minute and per day using charts for easier data interpretation.

---

## How to Run the Project Locally

### Quick Note
**Make sure to run backend and frontend separately in different terminals.**

### For Backend

1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Make sure you have Redis installed and running on your machine. You will get a message on console for Redis connection.

```bash
Connected to Redis server
Redis is connected and responding:PONG
```

3. Run `npm start` to start the backend server. This will start the server on `http://localhost:3000` and automatically builds the ts files and starts the server.

### For Frontend

1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. For environment variables, create a `.env` file in the `frontend` directory and add the following:

```bash
VITE_API_URL=http://localhost:3000/api/
```


> Note: This  url is set by default for the backend server in `configs` file. No need to add .env file if you are running backend on `http://localhost:3000`. 

3. Run `npm run dev` to start the frontend server. This will start the server on `http://localhost:5173`.

4. Open your browser and navigate to `http://localhost:5173` to view the React dashboard.


## API Endpoints

### 1. Send SMS

**Endpoint**: `/sms/send`

**Method**: `POST`

**Description**: Sends an SMS message to a specified phone number. Rate limits are applied based on IP and phone number.

**Request Body**:

```json
{
  "phoneNumber": "string",      // The phone number to send SMS to
  "message": "string"           // The message content
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

- **Validation Error**: `400 Bad Request`
  ```json
  {
    "status": "error",
    "message": "Invalid phone number or message content"
  }
  ```

---

### 2. Get SMS Usage Stats

**Endpoint**: `/stats/usage`

**Method**: `GET`

**Description**: Retrieves the current SMS usage statistics for a given phone number.

**Query Parameters**:

- `phoneNumber`: The phone number for which to retrieve SMS usage stats.

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/stats/usage?phoneNumber=1234567890"
```

**Response**:

- **Success**: `200 OK`
  ```json
  {
    "phoneNumber": "1234567890",
    "smsSentLastMinute": 3,
    "smsSentToday": 10
  }
  ```

- **Invalid Request**: `400 Bad Request`
  ```json
  {
    "status": "error",
    "message": "Phone number is required"
  }
  ```

---

### 3. Get Rate Limit Violations

**Endpoint**: `/stats/violations`

**Method**: `GET`

**Description**: Retrieves the rate limit violations that occurred in the last hour.

**Response**:

- **Success**: `200 OK`
  ```json
  {
    "violations": [
      {
        "phoneNumber": "1234567890",
        "ipAddress": "192.168.0.1",
        "time": "2024-10-08T12:00:00Z",
        "limitType": "minute",
        "retryAfter": "60 seconds"
      },
      {
        "phoneNumber": "0987654321",
        "ipAddress": "192.168.0.2",
        "time": "2024-10-08T12:05:00Z",
        "limitType": "day",
        "retryAfter": "24 hours"
      }
    ]
  }
  ```

