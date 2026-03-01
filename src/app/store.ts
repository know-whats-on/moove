import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type BoxSize = 'S' | 'M' | 'L';
export type MoveMode = 'MOVE_OUT' | 'MOVE_IN';
export type AddressStatus = 'To do' | 'Done';
export type TaskStatus = 'To do' | 'Done';

export interface Box {
  id: string;
  label: string;
  size: BoxSize;
  room: string;
  fragile: boolean;
  photo?: string;
  notes?: string;
  sealed: boolean;
  createdAt: number;
}

export interface BoxItem {
  id: string;
  boxId: string;
  name: string;
  quantity: number;
  unpacked: boolean;
  category?: string;
  notes?: string;
}

export interface AddressChangeItem {
  id: string;
  category: string;
  place: string;
  action: string;
  dueDate?: string;
  status: AddressStatus;
  notes?: string;
  link?: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
  status: TaskStatus;
  notes?: string;
  group?: string;
}

interface AppState {
  boxes: Box[];
  items: BoxItem[];
  addressChanges: AddressChangeItem[];
  checklistTasks: ChecklistTask[];
  darkMode: boolean;
  moveMode: MoveMode;
  userName: string | null;
  hasSeenOnboarding: boolean;
  onboardingStep: number;
  
  // New Fields
  moveDate: string | null;
  fromAddress: string;
  toAddress: string;
  fromCoords: { lat: number; lon: number } | null;
  toCoords: { lat: number; lon: number } | null;
  distanceText: string;

  // Actions
  setMoveMode: (mode: MoveMode) => void;
  setUserName: (name: string) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  setOnboardingStep: (step: number) => void;
  
  setMoveDate: (date: string | null) => void;
  setFromAddress: (address: string, coords?: { lat: number; lon: number }) => void;
  setToAddress: (address: string, coords?: { lat: number; lon: number }) => void;
  setDistanceText: (text: string) => void;

  startOnboarding: () => void;
  skipOnboarding: () => void;
  addBox: (box: Omit<Box, 'id' | 'createdAt'>) => void;
  updateBox: (id: string, updates: Partial<Box>) => void;
  removeBox: (id: string) => void;
  
  addItem: (item: Omit<BoxItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<BoxItem>) => void;
  removeItem: (id: string) => void;
  
  addAddressChange: (item: Omit<AddressChangeItem, 'id'>) => void;
  updateAddressChange: (id: string, updates: Partial<AddressChangeItem>) => void;
  removeAddressChange: (id: string) => void;
  
  addChecklistTask: (task: Omit<ChecklistTask, 'id'>) => void;
  updateChecklistTask: (id: string, updates: Partial<ChecklistTask>) => void;
  removeChecklistTask: (id: string) => void;
  
  toggleDarkMode: () => void;
  resetData: () => void;
  importData: (data: Partial<AppState>) => void;
}

// Initial Data
const initialAddressChanges: AddressChangeItem[] = [
  { id: '1', category: 'Bank/Finance', place: 'Bank', action: 'Update Address', status: 'To do' },
  { id: '2', category: 'Employer/Payroll', place: 'Employer', action: 'Notify HR', status: 'To do' },
  { id: '3', category: 'Government IDs', place: 'DMV', action: 'License Update', status: 'To do' },
  { id: '4', category: 'Utilities', place: 'Electricity', action: 'Transfer Service', status: 'To do' },
];

const initialChecklistTasks: ChecklistTask[] = [
  { id: '1', title: 'Give notice to landlord', status: 'To do' },
  { id: '2', title: 'Schedule cleaning', status: 'To do' },
  { id: '3', title: 'Complete condition report', status: 'To do' },
  { id: '4', title: 'Return keys', status: 'To do' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      boxes: [],
      items: [],
      addressChanges: initialAddressChanges,
      checklistTasks: initialChecklistTasks,
      darkMode: true,
      moveMode: 'MOVE_OUT',
      userName: null,
      hasSeenOnboarding: false,
      onboardingStep: 0,
      
      moveDate: null,
      fromAddress: '',
      toAddress: '',
      fromCoords: null,
      toCoords: null,
      distanceText: '',

      setMoveMode: (mode) => set({ moveMode: mode }),
      setUserName: (name) => set({ userName: name }),
      setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      setMoveDate: (date) => set({ moveDate: date }),
      setFromAddress: (address, coords) => set({ fromAddress: address, fromCoords: coords || null }),
      setToAddress: (address, coords) => set({ toAddress: address, toCoords: coords || null }),
      setDistanceText: (text) => set({ distanceText: text }),

      startOnboarding: () => set({ onboardingStep: 1 }),
      skipOnboarding: () => set({ onboardingStep: 0, hasSeenOnboarding: true }),

      addBox: (box) => set((state) => ({ 
        boxes: [...state.boxes, { ...box, id: uuidv4(), createdAt: Date.now() }] 
      })),
      updateBox: (id, updates) => set((state) => ({
        boxes: state.boxes.map((box) => (box.id === id ? { ...box, ...updates } : box)),
      })),
      removeBox: (id) => set((state) => ({
        boxes: state.boxes.filter((box) => box.id !== id),
        items: state.items.filter((item) => item.boxId !== id),
      })),

      addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, id: uuidv4() }]
      })),
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      addAddressChange: (item) => set((state) => ({
        addressChanges: [...state.addressChanges, { ...item, id: uuidv4() }]
      })),
      updateAddressChange: (id, updates) => set((state) => ({
        addressChanges: state.addressChanges.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      })),
      removeAddressChange: (id) => set((state) => ({
        addressChanges: state.addressChanges.filter((item) => item.id !== id),
      })),

      addChecklistTask: (task) => set((state) => ({
        checklistTasks: [...state.checklistTasks, { ...task, id: uuidv4() }]
      })),
      updateChecklistTask: (id, updates) => set((state) => ({
        checklistTasks: state.checklistTasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
      })),
      removeChecklistTask: (id) => set((state) => ({
        checklistTasks: state.checklistTasks.filter((task) => task.id !== id),
      })),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      resetData: () => set({ 
        boxes: [], 
        items: [], 
        addressChanges: initialAddressChanges, 
        checklistTasks: initialChecklistTasks,
        moveMode: 'MOVE_OUT'
      }),
      importData: (data) => set((state) => ({
        ...state,
        ...data,
        // Ensure arrays are at least empty if missing in import
        boxes: data.boxes || [],
        items: data.items || [],
        addressChanges: data.addressChanges || initialAddressChanges,
        checklistTasks: data.checklistTasks || initialChecklistTasks,
      })),
    }),
    {
      name: 'moove-storage',
    }
  )
);
