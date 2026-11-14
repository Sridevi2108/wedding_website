/**
 * Calendar utilities to generate Google Calendar links and ICS download files
 */

export function getGoogleCalendarUrl(
  title: string,
  details: string,
  location: string,
  startDateIso: string,
  endDateIso: string
): string {
  // Convert ISO string (e.g. 2026-12-14T06:15:00+05:30) to YYYYMMDDTHHmmssZ
  const start = new Date(startDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const end = new Date(endDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: details,
    location: location,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(
  title: string,
  details: string,
  location: string,
  startDateIso: string,
  endDateIso: string,
  fileName: string
) {
  const start = new Date(startDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const end = new Date(endDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//C. Vignesh & S. Pavithra Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${fileName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
