import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem } from '@mui/material';
import CustomToolbar from './customToolbar'; 
import convertDateToCorrect from '../util'
const localizer = momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const Calendar = ({
  events,
  onSelectEvent,
  view,
  onViewChange,
  selectable,
  resources = [], 
  mode,
  setEvents,
  date, 
  setDate,
  searchUser,
  setSearchUser,
}) => {
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    resourceId: ''
  });
  const [filteredEvents, setFilteredEvents] = useState(events); 

  const handleOpen = (slotInfo) => {
    let selectedResourceId = '';
    if (view === 'day' && slotInfo.resourceId) {
        selectedResourceId = slotInfo.resourceId; 
      } else {

        selectedResourceId = resources.length > 0 ? resources[0].id : '';
      }
    if (mode === 'booking') {
      setNewEvent({
        title: '',
        start: slotInfo.start,
        end: slotInfo.end,
        resourceId: selectedResourceId
      });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!newEvent.title || !newEvent.resourceId) {
      alert('Please fill in the event name and select the employee');
      return;
    }
    if (newEvent.start >= newEvent.end) {
      alert('The end time must be after the start time');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          resourceId: newEvent.resourceId,
        }),
      });
  
      const savedEvent = await response.json();
      const updatedEvents = [...events, convertDateToCorrect(savedEvent)];
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
      setOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const eventPropGetter = (event, start, end, isSelected) => {
    const currentView = view;
    const resource = resources.find(r => r.id === event.resourceId);
    const backgroundColor = resource ? 
      (resource.id === '1' ? '#3174ad' :
       resource.id === '2' ? '#ad3131' :
       '#1aad31') : '#000';
    const lighterTextColor = resource ? 
       (resource.id === '1' ? '#A9CCE3' :
        resource.id === '2' ? '#F1948A' :
        '#A9DFBF') : '#000';
    if (currentView === 'month') {
      return {
        style: {
          backgroundColor: backgroundColor,
          borderRadius: '12px', 
          color: 'black',      
          padding: '2px 8px',   
          textAlign: 'center',
          display: 'inline-block',
          fontSize: '0.8rem',   
          width: 'auto',        
          height: 'auto',       
          lineHeight: '1',      
        }
      };
    } else {

      return {
        style: {
          backgroundColor: lighterTextColor,      
          borderLeft: `5px solid ${backgroundColor}`,  
          color: backgroundColor,               
          padding: '4px',
          borderRadius: '4px',
          fontSize: '0.9rem',
          display: 'block',
        }
      };
    }
  };

  const handleEventResize = async (data) => {
    const { event, start, end } = data;
  
    const updatedEvent = { ...event, start, end };
  
    try {
      const response = await fetch(`http://localhost:5000/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
  
      const updatedEventFromServer = await response.json();
  
      const updatedEvents = events.map(evt =>
        evt.id === event.id ? convertDateToCorrect(updatedEventFromServer) : evt
      );
  
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEventDropAction = async ({ event, start, end, resourceId }) => {
    const updatedEvent = { ...event, start, end, resourceId: resourceId || event.resourceId };
  
    try {
      const response = await fetch(`http://localhost:5000/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
  
      const updatedEventFromServer = await response.json();
  
      const updatedEvents = events.map(evt =>
        evt.id === event.id ? convertDateToCorrect(updatedEventFromServer) : evt
      );
  
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleNavigate = (action) => {
    const currentMoment = moment(date);
    let newDate;
    switch (action) {
      case 'PREV':
        newDate = currentMoment.subtract(1, view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toDate();
        break;
      case 'NEXT':
        newDate = currentMoment.add(1, view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toDate();
        break;
      case 'TODAY':
        newDate = new Date();
        break;
      default:
        newDate = date;
    }
    console.log(newDate)
    setDate(newDate);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredEvents(events);  
      return;
    }


    const filtered = events.filter(event => {
      const employee = resources.find(resource => resource.id === event.resourceId);
      return employee && employee.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredEvents(filtered);  
  };

  return (
    <>
      <DragAndDropCalendar
        localizer={localizer}
        events={filteredEvents}
        defaultView={view}
        view={view}
        onView={onViewChange}
        onNavigate={handleNavigate}
        selectable={selectable}
        onSelectEvent={onSelectEvent}
        onSelectSlot={handleOpen}
        resizable={mode === 'booking'}
        onEventResize={handleEventResize}
        onEventDrop={handleEventDropAction}
        eventPropGetter={eventPropGetter}
        views={['month', 'week', 'day']}
        style={{ height: '100%' }}
        step={30}
        timeslots={2}
        popup
        toolbar
        draggableAccessor={() => mode === 'booking'}
        resources={view === 'day' ? resources : null}  
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
        date={date} 
        components={{
            toolbar: (props) => <CustomToolbar 
                    {...props} date={date} 
                    onNavigate={handleNavigate} onView={onViewChange} 
                    onSearch={handleSearch} searchUser={searchUser}
                    setSearchUser={setSearchUser}
                />,  
        }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Book event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Event Name"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            select
            label="Choose Staff"
            fullWidth
            value={newEvent.resourceId}
            onChange={(e) => setNewEvent({ ...newEvent, resourceId: e.target.value })}
            margin="dense"
          >
            {resources.map((resource) => (
              <MenuItem key={resource.id} value={resource.id}>
                {resource.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Start Time"
            type="datetime-local"
            fullWidth
            value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="End Time"
            type="datetime-local"
            fullWidth
            value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Calendar;
