# HR System for Woosh Flutter App

This document describes the comprehensive HR system implemented for the Woosh Flutter app backend, which handles attendance tracking, leave management, task management, notices, and payroll calculations.

## Overview

The HR system provides a complete solution for managing staff attendance, leave requests, tasks, company notices, and payroll calculations. It uses the existing database tables and adds a new attendance tracking table.

## Features

### 1. Attendance Management
- **Check-in/Check-out**: Staff can check in and out with location tracking
- **Late/Early Detection**: Automatic detection of late arrivals and early departures
- **Overtime Calculation**: Automatic calculation of overtime hours
- **Location Tracking**: GPS coordinates and location names for check-in/out
- **Image Capture**: Support for check-in/out photos
- **Device Information**: Track device details for security

### 2. Leave Management
- **Leave Requests**: Staff can submit leave requests
- **Leave Types**: Configurable leave types (annual, sick, etc.)
- **Leave Balances**: Track accrued and used leave
- **Approval Workflow**: Manager approval for leave requests
- **Overlap Prevention**: Prevent overlapping leave requests

### 3. Task Management
- **Task Assignment**: Managers can assign tasks to staff
- **Priority Levels**: Low, Medium, High, Urgent priorities
- **Status Tracking**: Pending, In Progress, Completed, Cancelled
- **Due Date Tracking**: Track task deadlines
- **Task Statistics**: Overview of task completion rates

### 4. Notice Board
- **Company Notices**: Post company-wide announcements
- **Country-specific**: Notices can be country-specific
- **Search Functionality**: Search through notices
- **Recent Notices**: Quick access to recent announcements

### 5. Payroll System
- **Automatic Calculation**: Calculate pay based on attendance
- **Overtime Pay**: 1.5x rate for overtime hours
- **Deductions**: Automatic deductions for late/early departures
- **Monthly Reports**: Monthly payroll summaries
- **Department Reports**: Department-wide payroll overview

## Database Tables Used

### Existing Tables (Enhanced)
1. **leave_requests** - Leave request management
2. **leave_balances** - Track leave balances
3. **leave_types** - Different types of leave
4. **tasks** - Task management
5. **NoticeBoard** - Company notices
6. **employee_types** - Employee categorization

### New Tables
1. **attendance** - Check-in/out tracking (NEW)

## API Endpoints

### Attendance Management
```
POST /hr/attendance/check-in          - Check in for the day
POST /hr/attendance/check-out         - Check out for the day
GET  /hr/attendance/current/:staffId  - Get current attendance status
GET  /hr/attendance/staff/:staffId    - Get attendance history
GET  /hr/attendance/date/:date        - Get attendance by date
GET  /hr/attendance/stats             - Get attendance statistics
GET  /hr/attendance/my-attendance     - Get my attendance history
GET  /hr/attendance/my-current        - Get my current status
GET  /hr/attendance/my-stats          - Get my attendance stats
```

### Leave Management
```
POST /hr/leave/request                - Submit leave request
PUT  /hr/leave/request/:id/approve    - Approve leave request
PUT  /hr/leave/request/:id/reject     - Reject leave request
GET  /hr/leave/requests               - Get leave requests
GET  /hr/leave/request/:id            - Get specific request
GET  /hr/leave/balance/:employeeId    - Get leave balance
GET  /hr/leave/balances/:employeeId   - Get all leave balances
GET  /hr/leave/types                  - Get leave types
POST /hr/leave/types                  - Create leave type
PUT  /hr/leave/types/:id              - Update leave type
DELETE /hr/leave/types/:id            - Delete leave type
GET  /hr/leave/stats                  - Get leave statistics
GET  /hr/leave/my-requests            - Get my leave requests
GET  /hr/leave/my-balances            - Get my leave balances
GET  /hr/leave/my-stats               - Get my leave stats
```

### Task Management
```
POST /hr/tasks                        - Create new task
PUT  /hr/tasks/:id                    - Update task
GET  /hr/tasks/:id                    - Get specific task
GET  /hr/tasks                        - Get all tasks
GET  /hr/tasks/staff/:salesRepId      - Get tasks by staff
GET  /hr/tasks/assigned-by/:assignedById - Get tasks assigned by
PUT  /hr/tasks/:id/complete           - Mark task as complete
PUT  /hr/tasks/:id/cancel             - Cancel task
DELETE /hr/tasks/:id                  - Delete task
GET  /hr/tasks/stats/overview         - Get task statistics
GET  /hr/tasks/overdue                - Get overdue tasks
GET  /hr/tasks/due-today              - Get tasks due today
GET  /hr/tasks/my-tasks               - Get my tasks
GET  /hr/tasks/my-assigned            - Get tasks I assigned
GET  /hr/tasks/my-stats               - Get my task stats
GET  /hr/tasks/my-due-today           - Get my tasks due today
```

### Notice Board
```
POST /hr/notices                      - Create notice
PUT  /hr/notices/:id                  - Update notice
GET  /hr/notices/:id                  - Get specific notice
GET  /hr/notices                      - Get all notices
GET  /hr/notices/recent/list          - Get recent notices
DELETE /hr/notices/:id                - Delete notice
GET  /hr/notices/search/query         - Search notices
GET  /hr/notices/stats/overview       - Get notice statistics
GET  /hr/notices/public/all           - Get public notices (managers)
GET  /hr/notices/public/recent        - Get public recent notices
```

### Payroll System
```
POST /hr/payroll/calculate            - Calculate payroll
GET  /hr/payroll/staff/:staffId       - Get staff payroll
GET  /hr/payroll/staff/:staffId/history - Get payroll history
GET  /hr/payroll/staff/:staffId/summary - Get payroll summary
GET  /hr/payroll/department/:departmentId - Get department payroll
GET  /hr/payroll/my-payroll           - Get my payroll
GET  /hr/payroll/my-history           - Get my payroll history
GET  /hr/payroll/my-summary           - Get my payroll summary
```

## Permission System

The HR system uses role-based access control:

### Staff Permissions
- View own attendance, leave requests, tasks, and payroll
- Submit leave requests
- Check in/out
- Update own tasks
- View notices for their country

### Manager Permissions
- View all staff data
- Approve/reject leave requests
- Assign tasks
- Create/edit notices
- View payroll reports
- Manage leave types

### Admin Permissions
- All manager permissions
- Delete records
- System-wide access

## Installation & Setup

### 1. Database Migration
Run the attendance migration script:
```sql
-- Execute attendance_migration.sql
```

### 2. Module Integration
The HR module is already integrated into the main app module.

### 3. Environment Variables
No additional environment variables are required.

## Usage Examples

### Check-in Example
```javascript
// Staff checking in
POST /hr/attendance/check-in
{
  "staffId": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "location": "Office Building",
  "deviceInfo": "iPhone 12"
}
```

### Leave Request Example
```javascript
// Staff submitting leave request
POST /hr/leave/request
{
  "employeeId": 1,
  "leaveTypeId": 1,
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "reason": "Family vacation",
  "isHalfDay": false
}
```

### Task Assignment Example
```javascript
// Manager assigning task
POST /hr/tasks
{
  "title": "Client Meeting Preparation",
  "description": "Prepare presentation for client meeting",
  "salesRepId": 2,
  "priority": "high"
}
```

### Payroll Calculation Example
```javascript
// Calculate monthly payroll
POST /hr/payroll/calculate
{
  "staffId": 1,
  "month": 1,
  "year": 2024,
  "hourlyRate": 15.00
}
```

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Permission Guards**: Role-based access control
3. **Data Isolation**: Staff can only access their own data
4. **Input Validation**: All inputs are validated
5. **SQL Injection Protection**: Using TypeORM parameterized queries

## Performance Considerations

1. **Database Indexes**: Optimized indexes for common queries
2. **Pagination**: Large result sets are paginated
3. **Caching**: Consider implementing Redis for frequently accessed data
4. **Query Optimization**: Efficient queries with proper joins

## Monitoring & Logging

1. **Error Handling**: Comprehensive error handling with meaningful messages
2. **Audit Trail**: Track changes to sensitive data
3. **Performance Monitoring**: Monitor API response times
4. **Usage Analytics**: Track feature usage

## Future Enhancements

1. **Mobile Push Notifications**: Notify staff of approvals/rejections
2. **Calendar Integration**: Sync with external calendars
3. **Reporting Dashboard**: Advanced analytics and reporting
4. **Time Tracking**: More detailed time tracking features
5. **Integration**: Integration with external HR systems

## Support

For technical support or questions about the HR system, please refer to the development team or create an issue in the project repository. 

This document describes the comprehensive HR system implemented for the Woosh Flutter app backend, which handles attendance tracking, leave management, task management, notices, and payroll calculations.

## Overview

The HR system provides a complete solution for managing staff attendance, leave requests, tasks, company notices, and payroll calculations. It uses the existing database tables and adds a new attendance tracking table.

## Features

### 1. Attendance Management
- **Check-in/Check-out**: Staff can check in and out with location tracking
- **Late/Early Detection**: Automatic detection of late arrivals and early departures
- **Overtime Calculation**: Automatic calculation of overtime hours
- **Location Tracking**: GPS coordinates and location names for check-in/out
- **Image Capture**: Support for check-in/out photos
- **Device Information**: Track device details for security

### 2. Leave Management
- **Leave Requests**: Staff can submit leave requests
- **Leave Types**: Configurable leave types (annual, sick, etc.)
- **Leave Balances**: Track accrued and used leave
- **Approval Workflow**: Manager approval for leave requests
- **Overlap Prevention**: Prevent overlapping leave requests

### 3. Task Management
- **Task Assignment**: Managers can assign tasks to staff
- **Priority Levels**: Low, Medium, High, Urgent priorities
- **Status Tracking**: Pending, In Progress, Completed, Cancelled
- **Due Date Tracking**: Track task deadlines
- **Task Statistics**: Overview of task completion rates

### 4. Notice Board
- **Company Notices**: Post company-wide announcements
- **Country-specific**: Notices can be country-specific
- **Search Functionality**: Search through notices
- **Recent Notices**: Quick access to recent announcements

### 5. Payroll System
- **Automatic Calculation**: Calculate pay based on attendance
- **Overtime Pay**: 1.5x rate for overtime hours
- **Deductions**: Automatic deductions for late/early departures
- **Monthly Reports**: Monthly payroll summaries
- **Department Reports**: Department-wide payroll overview

## Database Tables Used

### Existing Tables (Enhanced)
1. **leave_requests** - Leave request management
2. **leave_balances** - Track leave balances
3. **leave_types** - Different types of leave
4. **tasks** - Task management
5. **NoticeBoard** - Company notices
6. **employee_types** - Employee categorization

### New Tables
1. **attendance** - Check-in/out tracking (NEW)

## API Endpoints

### Attendance Management
```
POST /hr/attendance/check-in          - Check in for the day
POST /hr/attendance/check-out         - Check out for the day
GET  /hr/attendance/current/:staffId  - Get current attendance status
GET  /hr/attendance/staff/:staffId    - Get attendance history
GET  /hr/attendance/date/:date        - Get attendance by date
GET  /hr/attendance/stats             - Get attendance statistics
GET  /hr/attendance/my-attendance     - Get my attendance history
GET  /hr/attendance/my-current        - Get my current status
GET  /hr/attendance/my-stats          - Get my attendance stats
```

### Leave Management
```
POST /hr/leave/request                - Submit leave request
PUT  /hr/leave/request/:id/approve    - Approve leave request
PUT  /hr/leave/request/:id/reject     - Reject leave request
GET  /hr/leave/requests               - Get leave requests
GET  /hr/leave/request/:id            - Get specific request
GET  /hr/leave/balance/:employeeId    - Get leave balance
GET  /hr/leave/balances/:employeeId   - Get all leave balances
GET  /hr/leave/types                  - Get leave types
POST /hr/leave/types                  - Create leave type
PUT  /hr/leave/types/:id              - Update leave type
DELETE /hr/leave/types/:id            - Delete leave type
GET  /hr/leave/stats                  - Get leave statistics
GET  /hr/leave/my-requests            - Get my leave requests
GET  /hr/leave/my-balances            - Get my leave balances
GET  /hr/leave/my-stats               - Get my leave stats
```

### Task Management
```
POST /hr/tasks                        - Create new task
PUT  /hr/tasks/:id                    - Update task
GET  /hr/tasks/:id                    - Get specific task
GET  /hr/tasks                        - Get all tasks
GET  /hr/tasks/staff/:salesRepId      - Get tasks by staff
GET  /hr/tasks/assigned-by/:assignedById - Get tasks assigned by
PUT  /hr/tasks/:id/complete           - Mark task as complete
PUT  /hr/tasks/:id/cancel             - Cancel task
DELETE /hr/tasks/:id                  - Delete task
GET  /hr/tasks/stats/overview         - Get task statistics
GET  /hr/tasks/overdue                - Get overdue tasks
GET  /hr/tasks/due-today              - Get tasks due today
GET  /hr/tasks/my-tasks               - Get my tasks
GET  /hr/tasks/my-assigned            - Get tasks I assigned
GET  /hr/tasks/my-stats               - Get my task stats
GET  /hr/tasks/my-due-today           - Get my tasks due today
```

### Notice Board
```
POST /hr/notices                      - Create notice
PUT  /hr/notices/:id                  - Update notice
GET  /hr/notices/:id                  - Get specific notice
GET  /hr/notices                      - Get all notices
GET  /hr/notices/recent/list          - Get recent notices
DELETE /hr/notices/:id                - Delete notice
GET  /hr/notices/search/query         - Search notices
GET  /hr/notices/stats/overview       - Get notice statistics
GET  /hr/notices/public/all           - Get public notices (managers)
GET  /hr/notices/public/recent        - Get public recent notices
```

### Payroll System
```
POST /hr/payroll/calculate            - Calculate payroll
GET  /hr/payroll/staff/:staffId       - Get staff payroll
GET  /hr/payroll/staff/:staffId/history - Get payroll history
GET  /hr/payroll/staff/:staffId/summary - Get payroll summary
GET  /hr/payroll/department/:departmentId - Get department payroll
GET  /hr/payroll/my-payroll           - Get my payroll
GET  /hr/payroll/my-history           - Get my payroll history
GET  /hr/payroll/my-summary           - Get my payroll summary
```

## Permission System

The HR system uses role-based access control:

### Staff Permissions
- View own attendance, leave requests, tasks, and payroll
- Submit leave requests
- Check in/out
- Update own tasks
- View notices for their country

### Manager Permissions
- View all staff data
- Approve/reject leave requests
- Assign tasks
- Create/edit notices
- View payroll reports
- Manage leave types

### Admin Permissions
- All manager permissions
- Delete records
- System-wide access

## Installation & Setup

### 1. Database Migration
Run the attendance migration script:
```sql
-- Execute attendance_migration.sql
```

### 2. Module Integration
The HR module is already integrated into the main app module.

### 3. Environment Variables
No additional environment variables are required.

## Usage Examples

### Check-in Example
```javascript
// Staff checking in
POST /hr/attendance/check-in
{
  "staffId": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "location": "Office Building",
  "deviceInfo": "iPhone 12"
}
```

### Leave Request Example
```javascript
// Staff submitting leave request
POST /hr/leave/request
{
  "employeeId": 1,
  "leaveTypeId": 1,
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "reason": "Family vacation",
  "isHalfDay": false
}
```

### Task Assignment Example
```javascript
// Manager assigning task
POST /hr/tasks
{
  "title": "Client Meeting Preparation",
  "description": "Prepare presentation for client meeting",
  "salesRepId": 2,
  "priority": "high"
}
```

### Payroll Calculation Example
```javascript
// Calculate monthly payroll
POST /hr/payroll/calculate
{
  "staffId": 1,
  "month": 1,
  "year": 2024,
  "hourlyRate": 15.00
}
```

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Permission Guards**: Role-based access control
3. **Data Isolation**: Staff can only access their own data
4. **Input Validation**: All inputs are validated
5. **SQL Injection Protection**: Using TypeORM parameterized queries

## Performance Considerations

1. **Database Indexes**: Optimized indexes for common queries
2. **Pagination**: Large result sets are paginated
3. **Caching**: Consider implementing Redis for frequently accessed data
4. **Query Optimization**: Efficient queries with proper joins

## Monitoring & Logging

1. **Error Handling**: Comprehensive error handling with meaningful messages
2. **Audit Trail**: Track changes to sensitive data
3. **Performance Monitoring**: Monitor API response times
4. **Usage Analytics**: Track feature usage

## Future Enhancements

1. **Mobile Push Notifications**: Notify staff of approvals/rejections
2. **Calendar Integration**: Sync with external calendars
3. **Reporting Dashboard**: Advanced analytics and reporting
4. **Time Tracking**: More detailed time tracking features
5. **Integration**: Integration with external HR systems

## Support

For technical support or questions about the HR system, please refer to the development team or create an issue in the project repository. 