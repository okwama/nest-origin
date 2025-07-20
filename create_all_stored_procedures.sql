-- =====================================================
-- WOOSH NESTJS STORED PROCEDURES
-- =====================================================
-- This file contains all the stored procedures needed for the Woosh NestJS backend
-- Run this file against your MySQL database to create all required procedures

DELIMITER $$

-- =====================================================
-- 1. GetCurrentAttendanceStatus Procedure
-- =====================================================
-- Purpose: Get the current day's attendance status for a staff member
-- Parameters: p_staff_id (INT) - Staff ID
-- Returns: Current attendance record for today

CREATE PROCEDURE GetCurrentAttendanceStatus(IN p_staff_id INT)
BEGIN
    SELECT 
        id,
        staff_id,
        date,
        checkin_time,
        checkout_time,
        checkin_latitude,
        checkin_longitude,
        checkout_latitude,
        checkout_longitude,
        checkin_location,
        checkout_location,
        checkin_ip,
        checkout_ip,
        status,
        type,
        total_hours,
        overtime_hours,
        is_late,
        late_minutes,
        device_info,
        timezone,
        shift_start,
        shift_end,
        is_early_departure,
        early_departure_minutes,
        notes,
        created_at,
        updated_at
    FROM attendance 
    WHERE staff_id = p_staff_id 
    AND date = CURDATE()
    ORDER BY created_at DESC
    LIMIT 1;
END$$

-- =====================================================
-- 2. CheckInStaff Procedure
-- =====================================================
-- Purpose: Handle staff check-in with validation and calculations
-- Parameters: 
--   p_staff_id (INT) - Staff ID
--   p_ip_address (VARCHAR) - IP address
--   p_latitude (DECIMAL) - Check-in latitude
--   p_longitude (DECIMAL) - Check-in longitude
--   p_location (VARCHAR) - Check-in location
--   p_device_info (TEXT) - Device information
-- Returns: JSON result with status and message

CREATE PROCEDURE CheckInStaff(
    IN p_staff_id INT,
    IN p_ip_address VARCHAR(45),
    IN p_latitude DECIMAL(10,8),
    IN p_longitude DECIMAL(11,8),
    IN p_location VARCHAR(255),
    IN p_device_info TEXT
)
BEGIN
    DECLARE v_today DATE DEFAULT CURDATE();
    DECLARE v_checkin_time DATETIME DEFAULT NOW();
    DECLARE v_shift_start TIME DEFAULT '09:00:00';
    DECLARE v_shift_end TIME DEFAULT '17:00:00';
    DECLARE v_is_late BOOLEAN DEFAULT FALSE;
    DECLARE v_late_minutes INT DEFAULT 0;
    DECLARE v_existing_id INT DEFAULT NULL;
    
    -- Check if already checked in today
    SELECT id INTO v_existing_id 
    FROM attendance 
    WHERE staff_id = p_staff_id 
    AND date = v_today 
    AND checkin_time IS NOT NULL;
    
    IF v_existing_id IS NOT NULL THEN
        SELECT JSON_OBJECT(
            'result', 'ERROR',
            'message', 'Already checked in today'
        ) AS result;
    ELSE
        -- Calculate if late
        IF TIME(v_checkin_time) > v_shift_start THEN
            SET v_is_late = TRUE;
            SET v_late_minutes = TIMESTAMPDIFF(MINUTE, 
                CONCAT(v_today, ' ', v_shift_start), 
                v_checkin_time
            );
        END IF;
        
        -- Insert or update attendance record
        INSERT INTO attendance (
            staff_id, date, checkin_time, checkin_latitude, 
            checkin_longitude, checkin_location, checkin_ip,
            is_late, late_minutes, status, type, device_info,
            timezone, shift_start, shift_end, created_at, updated_at
        ) VALUES (
            p_staff_id, v_today, v_checkin_time, p_latitude,
            p_longitude, p_location, p_ip_address,
            v_is_late, v_late_minutes, 1, 'regular', p_device_info,
            'UTC', v_shift_start, v_shift_end, NOW(), NOW()
        ) ON DUPLICATE KEY UPDATE
            checkin_time = v_checkin_time,
            checkin_latitude = p_latitude,
            checkin_longitude = p_longitude,
            checkin_location = p_location,
            checkin_ip = p_ip_address,
            is_late = v_is_late,
            late_minutes = v_late_minutes,
            status = 1,
            device_info = p_device_info,
            updated_at = NOW();
        
        SELECT JSON_OBJECT(
            'result', 'SUCCESS',
            'message', 'Check-in successful'
        ) AS result;
    END IF;
END$$

-- =====================================================
-- 3. CheckOutStaff Procedure
-- =====================================================
-- Purpose: Handle staff check-out with calculations
-- Parameters:
--   p_staff_id (INT) - Staff ID
--   p_ip_address (VARCHAR) - IP address
--   p_latitude (DECIMAL) - Check-out latitude
--   p_longitude (DECIMAL) - Check-out longitude
--   p_location (VARCHAR) - Check-out location
-- Returns: JSON result with status and message

CREATE PROCEDURE CheckOutStaff(
    IN p_staff_id INT,
    IN p_ip_address VARCHAR(45),
    IN p_latitude DECIMAL(10,8),
    IN p_longitude DECIMAL(11,8),
    IN p_location VARCHAR(255)
)
BEGIN
    DECLARE v_today DATE DEFAULT CURDATE();
    DECLARE v_checkout_time DATETIME DEFAULT NOW();
    DECLARE v_shift_end TIME DEFAULT '17:00:00';
    DECLARE v_is_early_departure BOOLEAN DEFAULT FALSE;
    DECLARE v_early_departure_minutes INT DEFAULT 0;
    DECLARE v_total_hours DECIMAL(5,2) DEFAULT 0;
    DECLARE v_overtime_hours DECIMAL(5,2) DEFAULT 0;
    DECLARE v_checkin_time DATETIME DEFAULT NULL;
    DECLARE v_existing_id INT DEFAULT NULL;
    
    -- Check if there's a check-in record for today
    SELECT id, checkin_time INTO v_existing_id, v_checkin_time
    FROM attendance 
    WHERE staff_id = p_staff_id 
    AND date = v_today 
    AND checkin_time IS NOT NULL;
    
    IF v_existing_id IS NULL THEN
        SELECT JSON_OBJECT(
            'result', 'ERROR',
            'message', 'No check-in record found for today'
        ) AS result;
    ELSE
        -- Check if already checked out
        IF EXISTS (
            SELECT 1 FROM attendance 
            WHERE staff_id = p_staff_id 
            AND date = v_today 
            AND checkout_time IS NOT NULL
        ) THEN
            SELECT JSON_OBJECT(
                'result', 'ERROR',
                'message', 'Already checked out today'
            ) AS result;
        ELSE
            -- Calculate total hours
            SET v_total_hours = TIMESTAMPDIFF(MINUTE, v_checkin_time, v_checkout_time) / 60.0;
            
            -- Calculate if early departure
            IF TIME(v_checkout_time) < v_shift_end THEN
                SET v_is_early_departure = TRUE;
                SET v_early_departure_minutes = TIMESTAMPDIFF(MINUTE, 
                    v_checkout_time, 
                    CONCAT(v_today, ' ', v_shift_end)
                );
            END IF;
            
            -- Calculate overtime (hours beyond 8 hours)
            IF v_total_hours > 8 THEN
                SET v_overtime_hours = v_total_hours - 8;
            END IF;
            
            -- Update attendance record
            UPDATE attendance SET
                checkout_time = v_checkout_time,
                checkout_latitude = p_latitude,
                checkout_longitude = p_longitude,
                checkout_location = p_location,
                checkout_ip = p_ip_address,
                total_hours = v_total_hours,
                overtime_hours = v_overtime_hours,
                is_early_departure = v_is_early_departure,
                early_departure_minutes = v_early_departure_minutes,
                status = 2, -- Checked out
                updated_at = NOW()
            WHERE id = v_existing_id;
            
            SELECT JSON_OBJECT(
                'result', 'SUCCESS',
                'message', 'Check-out successful'
            ) AS result;
        END IF;
    END IF;
END$$

-- =====================================================
-- 4. GetStaffAttendance Procedure
-- =====================================================
-- Purpose: Get attendance records for a staff member within a date range
-- Parameters:
--   p_staff_id (INT) - Staff ID
--   p_start_date (DATE) - Start date
--   p_end_date (DATE) - End date
-- Returns: Attendance records within the date range

CREATE PROCEDURE GetStaffAttendance(
    IN p_staff_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        id,
        staff_id,
        date,
        checkin_time,
        checkout_time,
        checkin_latitude,
        checkin_longitude,
        checkout_latitude,
        checkout_longitude,
        checkin_location,
        checkout_location,
        checkin_ip,
        checkout_ip,
        status,
        type,
        total_hours,
        overtime_hours,
        is_late,
        late_minutes,
        device_info,
        timezone,
        shift_start,
        shift_end,
        is_early_departure,
        early_departure_minutes,
        notes,
        created_at,
        updated_at
    FROM attendance 
    WHERE staff_id = p_staff_id 
    AND date BETWEEN p_start_date AND p_end_date
    ORDER BY date DESC, created_at DESC;
END$$

DELIMITER ;

-- =====================================================
-- PROCEDURE CREATION COMPLETE
-- =====================================================
-- All required stored procedures have been created:
-- 1. GetCurrentAttendanceStatus - Get today's attendance
-- 2. CheckInStaff - Handle staff check-in
-- 3. CheckOutStaff - Handle staff check-out  
-- 4. GetStaffAttendance - Get attendance history
-- ===================================================== 