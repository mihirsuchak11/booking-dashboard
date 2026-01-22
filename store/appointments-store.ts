import { create } from "zustand";
import { startOfWeek, addWeeks, subWeeks, addDays } from "date-fns";
import { CalendarAppointment } from "@/lib/dashboard-data";

interface AppointmentsState {
  currentWeekStart: Date;
  searchQuery: string;
  statusFilter: "all" | "confirmed" | "pending" | "cancelled";
  appointments: CalendarAppointment[];
  loading: boolean;
  businessId: string | null;
  today: Date;
  fetchAppointments:
    | ((weekStart: Date) => Promise<CalendarAppointment[]>)
    | null;

  // Actions
  setBusinessId: (businessId: string) => void;
  setAppointments: (appointments: CalendarAppointment[]) => void;
  setFetchFunction: (
    fn: (weekStart: Date) => Promise<CalendarAppointment[]>
  ) => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToToday: () => void;
  goToDate: (date: Date) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (
    filter: "all" | "confirmed" | "pending" | "cancelled"
  ) => void;
  getCurrentWeekAppointments: () => CalendarAppointment[];
  getWeekDays: () => Date[];
}

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
  today: new Date(),
  searchQuery: "",
  statusFilter: "all",
  appointments: [],
  loading: false,
  businessId: null,
  fetchAppointments: null,

  setBusinessId: (businessId: string) => set({ businessId }),

  setAppointments: (appointments: CalendarAppointment[]) =>
    set({ appointments }),

  setFetchFunction: (fn: (weekStart: Date) => Promise<CalendarAppointment[]>) =>
    set({ fetchAppointments: fn }),

  goToNextWeek: async () => {
    const state = get();
    const newWeekStart = addWeeks(state.currentWeekStart, 1);
    set({ currentWeekStart: newWeekStart, loading: true });

    if (state.fetchAppointments) {
      const appointments = await state.fetchAppointments(newWeekStart);
      set({ appointments, loading: false });
    } else {
      set({ loading: false });
    }
  },

  goToPreviousWeek: async () => {
    const state = get();
    const newWeekStart = subWeeks(state.currentWeekStart, 1);
    set({ currentWeekStart: newWeekStart, loading: true });

    if (state.fetchAppointments) {
      const appointments = await state.fetchAppointments(newWeekStart);
      set({ appointments, loading: false });
    } else {
      set({ loading: false });
    }
  },

  goToToday: async () => {
    const state = get();
    const todayWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    set({ currentWeekStart: todayWeekStart, loading: true });

    if (state.fetchAppointments) {
      const appointments = await state.fetchAppointments(todayWeekStart);
      set({ appointments, loading: false });
    } else {
      set({ loading: false });
    }
  },

  goToDate: async (date: Date) => {
    const state = get();
    const newWeekStart = startOfWeek(date, { weekStartsOn: 1 });
    set({ currentWeekStart: newWeekStart, loading: true });

    if (state.fetchAppointments) {
      const appointments = await state.fetchAppointments(newWeekStart);
      set({ appointments, loading: false });
    } else {
      set({ loading: false });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setStatusFilter: (filter: "all" | "confirmed" | "pending" | "cancelled") =>
    set({ statusFilter: filter }),

  getCurrentWeekAppointments: () => {
    const state = get();
    let weekAppointments = state.appointments;

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      weekAppointments = weekAppointments.filter(
        (apt) =>
          apt.customerName.toLowerCase().includes(query) ||
          apt.serviceName.toLowerCase().includes(query) ||
          apt.customerPhone?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (state.statusFilter !== "all") {
      weekAppointments = weekAppointments.filter(
        (apt) => apt.status === state.statusFilter
      );
    }

    return weekAppointments;
  },

  getWeekDays: () => {
    const state = get();
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(state.currentWeekStart, i));
    }
    return days;
  },
}));
