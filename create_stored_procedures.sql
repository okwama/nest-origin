-- Create the missing GetCurrentAttendanceStatus stored procedure
DELIMITER $$

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
    AND status = 1
    ORDER BY created_at DESC
    LIMIT 1;
END$$

DELIMITER ; 