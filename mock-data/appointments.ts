export interface Appointment {
  id: string;
  title: string; // Service name + Customer name
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  date: string; // "2024-11-25"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  servicePrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  notes?: string;
}

// Generate dates relative to current week
function getRelativeDate(daysFromToday: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split("T")[0];
}

// Mock appointments data
export const appointments: Appointment[] = [
  // Today's appointments
  {
    id: "1",
    title: "Haircut - John Smith",
    startTime: "09:00",
    endTime: "09:45",
    date: getRelativeDate(0),
    customerName: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    customerEmail: "john.smith@email.com",
    serviceName: "Haircut",
    servicePrice: 35,
    status: "confirmed",
    notes: "Regular customer, prefers short sides",
  },
  {
    id: "2",
    title: "Consultation - Sarah Johnson",
    startTime: "10:00",
    endTime: "10:30",
    date: getRelativeDate(0),
    customerName: "Sarah Johnson",
    customerPhone: "+1 (555) 234-5678",
    customerEmail: "sarah.j@email.com",
    serviceName: "Consultation",
    servicePrice: 0,
    status: "confirmed",
  },
  {
    id: "3",
    title: "Full Color - Emily Davis",
    startTime: "11:00",
    endTime: "13:00",
    date: getRelativeDate(0),
    customerName: "Emily Davis",
    customerPhone: "+1 (555) 345-6789",
    serviceName: "Full Color",
    servicePrice: 120,
    status: "pending",
    notes: "First time customer",
  },
  {
    id: "4",
    title: "Beard Trim - Mike Wilson",
    startTime: "14:00",
    endTime: "14:30",
    date: getRelativeDate(0),
    customerName: "Mike Wilson",
    customerPhone: "+1 (555) 456-7890",
    serviceName: "Beard Trim",
    servicePrice: 20,
    status: "confirmed",
  },
  {
    id: "5",
    title: "Haircut & Style - Lisa Brown",
    startTime: "15:00",
    endTime: "16:00",
    date: getRelativeDate(0),
    customerName: "Lisa Brown",
    customerPhone: "+1 (555) 567-8901",
    serviceName: "Haircut & Style",
    servicePrice: 55,
    status: "confirmed",
  },
  // Tomorrow
  {
    id: "6",
    title: "Deep Conditioning - Anna Lee",
    startTime: "09:30",
    endTime: "10:30",
    date: getRelativeDate(1),
    customerName: "Anna Lee",
    customerPhone: "+1 (555) 678-9012",
    serviceName: "Deep Conditioning",
    servicePrice: 45,
    status: "confirmed",
  },
  {
    id: "7",
    title: "Haircut - David Chen",
    startTime: "11:00",
    endTime: "11:45",
    date: getRelativeDate(1),
    customerName: "David Chen",
    customerPhone: "+1 (555) 789-0123",
    serviceName: "Haircut",
    servicePrice: 35,
    status: "pending",
  },
  {
    id: "8",
    title: "Highlights - Rachel Green",
    startTime: "13:00",
    endTime: "15:30",
    date: getRelativeDate(1),
    customerName: "Rachel Green",
    customerPhone: "+1 (555) 890-1234",
    serviceName: "Highlights",
    servicePrice: 150,
    status: "confirmed",
    notes: "Wants balayage style",
  },
  {
    id: "9",
    title: "Men's Grooming - Tom Harris",
    startTime: "16:00",
    endTime: "17:00",
    date: getRelativeDate(1),
    customerName: "Tom Harris",
    customerPhone: "+1 (555) 901-2345",
    serviceName: "Men's Grooming Package",
    servicePrice: 65,
    status: "confirmed",
  },
  // Day after tomorrow
  {
    id: "10",
    title: "Bridal Trial - Jessica Martinez",
    startTime: "10:00",
    endTime: "12:00",
    date: getRelativeDate(2),
    customerName: "Jessica Martinez",
    customerPhone: "+1 (555) 012-3456",
    serviceName: "Bridal Hair Trial",
    servicePrice: 100,
    status: "confirmed",
    notes: "Wedding in 3 weeks, wants updo",
  },
  {
    id: "11",
    title: "Haircut - Kevin Park",
    startTime: "13:00",
    endTime: "13:45",
    date: getRelativeDate(2),
    customerName: "Kevin Park",
    customerPhone: "+1 (555) 123-4567",
    serviceName: "Haircut",
    servicePrice: 35,
    status: "cancelled",
  },
  {
    id: "12",
    title: "Color Touch-up - Maria Garcia",
    startTime: "14:00",
    endTime: "15:30",
    date: getRelativeDate(2),
    customerName: "Maria Garcia",
    customerPhone: "+1 (555) 234-5678",
    serviceName: "Color Touch-up",
    servicePrice: 75,
    status: "confirmed",
  },
  // 3 days from now
  {
    id: "13",
    title: "Haircut - Alex Turner",
    startTime: "09:00",
    endTime: "09:45",
    date: getRelativeDate(3),
    customerName: "Alex Turner",
    customerPhone: "+1 (555) 345-6789",
    serviceName: "Haircut",
    servicePrice: 35,
    status: "pending",
  },
  {
    id: "14",
    title: "Keratin Treatment - Sophie Williams",
    startTime: "10:00",
    endTime: "13:00",
    date: getRelativeDate(3),
    customerName: "Sophie Williams",
    customerPhone: "+1 (555) 456-7890",
    serviceName: "Keratin Treatment",
    servicePrice: 200,
    status: "confirmed",
  },
  {
    id: "15",
    title: "Beard Trim - James Anderson",
    startTime: "14:00",
    endTime: "14:30",
    date: getRelativeDate(3),
    customerName: "James Anderson",
    customerPhone: "+1 (555) 567-8901",
    serviceName: "Beard Trim",
    servicePrice: 20,
    status: "confirmed",
  },
  // 4 days from now
  {
    id: "16",
    title: "Full Service - Olivia Taylor",
    startTime: "09:00",
    endTime: "11:30",
    date: getRelativeDate(4),
    customerName: "Olivia Taylor",
    customerPhone: "+1 (555) 678-9012",
    serviceName: "Haircut + Color + Style",
    servicePrice: 180,
    status: "confirmed",
  },
  {
    id: "17",
    title: "Consultation - Daniel White",
    startTime: "12:00",
    endTime: "12:30",
    date: getRelativeDate(4),
    customerName: "Daniel White",
    customerPhone: "+1 (555) 789-0123",
    serviceName: "Consultation",
    servicePrice: 0,
    status: "pending",
  },
  {
    id: "18",
    title: "Haircut - Emma Thompson",
    startTime: "14:00",
    endTime: "14:45",
    date: getRelativeDate(4),
    customerName: "Emma Thompson",
    customerPhone: "+1 (555) 890-1234",
    serviceName: "Haircut",
    servicePrice: 35,
    status: "confirmed",
  },
  // 5 days from now
  {
    id: "19",
    title: "Hair Extensions - Mia Roberts",
    startTime: "10:00",
    endTime: "14:00",
    date: getRelativeDate(5),
    customerName: "Mia Roberts",
    customerPhone: "+1 (555) 901-2345",
    serviceName: "Hair Extensions",
    servicePrice: 350,
    status: "confirmed",
    notes: "Tape-in extensions, 20 inches",
  },
  {
    id: "20",
    title: "Haircut - Ryan Clark",
    startTime: "15:00",
    endTime: "15:45",
    date: getRelativeDate(5),
    customerName: "Ryan Clark",
    customerPhone: "+1 (555) 012-3456",
    serviceName: "Haircut",
    servicePrice: 35,
    status: "confirmed",
  },
  // 6 days from now (weekend)
  {
    id: "21",
    title: "Wedding Party - Multiple",
    startTime: "08:00",
    endTime: "12:00",
    date: getRelativeDate(6),
    customerName: "Wedding Party",
    customerPhone: "+1 (555) 111-2222",
    serviceName: "Bridal Party Package",
    servicePrice: 500,
    status: "confirmed",
    notes: "Bride + 4 bridesmaids",
  },
];

export function getAppointmentsForDate(date: string): Appointment[] {
  return appointments.filter((apt) => apt.date === date);
}

export function getAppointmentsForWeek(startDate: Date): Appointment[] {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return aptDate >= startDate && aptDate <= endDate;
  });
}

export function getTodayAppointments(): Appointment[] {
  const today = new Date().toISOString().split("T")[0];
  return appointments.filter((apt) => apt.date === today);
}

export function getAppointmentStats() {
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((apt) => apt.date === today);

  return {
    total: todayAppts.length,
    confirmed: todayAppts.filter((apt) => apt.status === "confirmed").length,
    pending: todayAppts.filter((apt) => apt.status === "pending").length,
    cancelled: todayAppts.filter((apt) => apt.status === "cancelled").length,
  };
}

