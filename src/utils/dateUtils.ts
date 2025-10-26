/**
 * Format a date string (YYYY-MM-DD) to a localized date string
 * Avoids timezone issues by parsing the date components explicitly
 */
export const formatDate = (dateString: string): string => {
  // Parse date explicitly to avoid timezone issues
  const [year, month, day] = dateString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
