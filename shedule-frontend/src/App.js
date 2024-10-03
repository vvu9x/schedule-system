import React, { useState, useEffect } from 'react';
import { Box, ToggleButton, ToggleButtonGroup} from '@mui/material';
import Calendar from './components/Calendar';
import DatePickerComponent from './components/DatePickerComponent';
import TodaySchedule from './components/TodaySchedule';
import { format } from 'date-fns';


const convertUserToTitle = (data) => {
  return data.map(employee => {
    const { name, ...rest } = employee; 
    return { ...rest, title: name }; 
  });
};

const convertDateToCorrect = (data) => {
  return data.map(events => {
    const {  start, end, ...rest } = events; 
    return { ...rest, start:new Date(start), end:new Date(end) }; 
  });
};

const App = () => {
  const [view, setView] = useState('month'); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState('view'); 
  const [searchUser, setSearchUser] = useState('');
  const [employees, setEmployees] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const eventResponse = await fetch('http://localhost:5000/events');
        const eventData = await eventResponse.json();
        const updatedEventData = convertDateToCorrect(eventData);
        setEvents(updatedEventData);  

        const employeeResponse = await fetch('http://localhost:5000/resources');
        const employeeData = await employeeResponse.json();
        const updatedEmployeeData = convertUserToTitle(employeeData);
        console.log(updatedEmployeeData)
        setEmployees(updatedEmployeeData);  
        console.log(eventData)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleSelectEvent = (event) => {

    const employee = employees.find(emp => emp.id === event.resourceId)?.title || 'Unknown employee';
    alert(`event: ${event.title}\nemployee: ${employee}\ntime: ${format(new Date(event.start), 'Pp')} - ${format(new Date(event.end), 'Pp')}`);
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Box className="calendar-container">
      <Box className="left-panel">
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="Mode Switching"
          style={{ marginBottom: '16px' }}
        >
          <ToggleButton value="view" aria-label="View Mode">
            View Mode
          </ToggleButton>
          <ToggleButton value="booking" aria-label="Schedule Mode">
            Schedule Mode
          </ToggleButton>
        </ToggleButtonGroup>
        <Calendar
          events={events}
          onSelectEvent={handleSelectEvent}
          view={view}
          onViewChange={handleViewChange}
          selectable={mode === 'booking'}
          onEventResize={() => { }}
          onEventDrop={() => { }}
          resources={employees} 
          mode={mode}
          setEvents={setEvents}
          date={selectedDate} 
          setDate={setSelectedDate}
          searchUser={searchUser}
          setSearchUser={setSearchUser}
        />
      </Box>
      <Box className="right-panel" sx={{paddingTop: '82px'}}>
        <DatePickerComponent selectedDate={selectedDate} onDateChange={handleDateChange} events={events}/>
        <Box className="today-schedule">
          <TodaySchedule events={events} employees={employees} selectedDate={selectedDate} />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
