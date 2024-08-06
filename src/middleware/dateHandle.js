// Generate date range array with start date and end date
const generateDateRange = (dateStart, dateEnd) => {
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);

  const dateRange = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateRange.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateRange;
};

// Generate date range array with year and month
const generateDates = (year, month) => {
    const dates = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        // Membuat string tanggal dalam format YYYY-MM-DD
        const date = new Date(year, month - 1, day + 1);
        const formattedDate = date.toISOString().split('T')[0];    
        dates.push(formattedDate);
    }
    return dates;
}

module.exports = {
  generateDateRange,
  generateDates
}