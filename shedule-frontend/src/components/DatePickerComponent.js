import React from 'react';
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { isSameDay } from 'date-fns';

const employees = [
    { id: '1', name: 'Alice', color:'#3357FF'},
    { id: '2', name: 'Bob', color: '#FF5733' },
    { id: '3', name: 'Charlie', color: '#33FF57' },
];

const DatePickerComponent = ({ selectedDate, onDateChange, events }) => {

    const getUnassignedEmployees = (date) => {
        const eventsForDay = events.filter((event) => isSameDay(event.start, date));
      
        if (!Array.isArray(eventsForDay) || eventsForDay.length === 0) {
          return employees;
        }
      
        const assignedEmployeeIds = eventsForDay.map((event) => event.resourceId);
      
        return employees.filter((employee) => !assignedEmployeeIds.includes(employee.id));
    };
    function CustomDay(props) {
        const { day, selectedDay, outsideCurrentMonth, ...other } = props;
      
        const unassignedEmployees = getUnassignedEmployees(day);
      
        return  (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
              {unassignedEmployees.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                  {unassignedEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: employee.color,
                        borderRadius: '50%',
                        marginTop: '1px', 
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
    }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar
        value={selectedDate}
        onChange={(newValue) => {
          onDateChange(newValue);
        }}
        slots={{ day: CustomDay }} 
        slotProps={{
          day: { selectedDay: selectedDate }, 
        }}
        sx={{ margin: 0 }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
