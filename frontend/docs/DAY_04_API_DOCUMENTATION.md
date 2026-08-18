# Lane 1: Infinite Vehicle Roster System — Day 4 API Documentation

## Endpoint: `GET /api/vehicles`
Fetches a paginated, searchable, filterable, and sortable list of fleet vehicles using cursor-based pagination.

---

### 1. Request Query Parameters

| Parameter | Type | Required | Default | Allowed Values | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cursor` | `string` | No | `null` | Any valid 24-char ObjectId | Pointer to the last vehicle `_id` received from previous page. |
| `limit` | `number` | No | `20` | `1` to `100` | Number of vehicle records to fetch per page. |
| `search` | `string` | No | `""` | Any string | Case-insensitive substring match against `vehicleNumber` or `driverName`. |
| `status` | `string` | No | `ALL` | `ALL`, `MOVING`, `IDLE`, `STOPPED`, `OFFLINE` | Filter vehicles by current operational status. |
| `sortBy` | `string` | No | `lastUpdated`| `lastUpdated`, `vehicleNumber`, `speed` | Database field to sort results by. |
| `sortOrder`| `string` | No | `desc` | `asc`, `desc` | Ascending or Descending sort order. |

---

### 2. Response Formats

#### ✅ Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "65e8a9bc7f2e1a3b4c5d6e7f",
        "vehicleNumber": "DL-01-AB-1234",
        "driverName": "Vikram Singh",
        "status": "MOVING",
        "fuel": 84,
        "speed": 55,
        "heading": 180,
        "lastUpdated": "2025-02-23T14:32:00.000Z",
        "latitude": 28.6139,
        "longitude": 77.2090
      }
    ],
    "pagination": {
      "nextCursor": "65e8a9bc7f2e1a3b4c5d6e8a",
      "hasNextPage": true,
      "limit": 20,
      "totalReturned": 20
    }
  }
}
{
  "success": false,
  "error": {
    "code": "INVALID_QUERY_PARAMETER",
    "message": "Limit must be a positive integer between 1 and 100."
  }
}
1. First Page Request:
   GET /api/vehicles?limit=20
   └── Response: vehicles[0..19], nextCursor = "65e8a9bc..."

2. Second Page Request (Triggered by Scroll):
   GET /api/vehicles?limit=20&cursor=65e8a9bc...
   └── Response: vehicles[20..39], nextCursor = "65e8b1aa..."

3. Final Page Request:
   GET /api/vehicles?limit=20&cursor=65e8b1aa...
   └── Response: vehicles[40..47], nextCursor = null, hasNextPage = false