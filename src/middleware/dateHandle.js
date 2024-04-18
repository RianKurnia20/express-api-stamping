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

module.exports = {
  generateDateRange,
}