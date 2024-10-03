const convertDateToCorrect = (data) => {
    
    const {  start, end, ...rest } = data; 
    return { ...rest, start:new Date(start), end:new Date(end) }; 
};

export default convertDateToCorrect; 