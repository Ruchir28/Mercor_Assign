// recoilstate.ts
import { atom } from 'recoil';
import { Prisma } from "@prisma/client";

export type FilterState = {
  companies: string[];
  educational_institutes: string[];
  major: string[];
  skills: string[];
};

export type UserWithSkills = Prisma.MercorUsersGetPayload<{
  include: {
    MercorUserSkills: {
      include: {
        Skills: true
      }
    }
  }
}>;

export const filtersState = atom<FilterState>({
  key: 'filtersState',
  default: {
    companies: [],
    educational_institutes: [],
    major: [],
    skills: []
  }
});

export const lastFetchedFiltersState = atom<FilterState | null>({
  key: 'lastFetchedFiltersState',
  default: null
});

export const usersState = atom<UserWithSkills[]>({
  key: 'usersState',
  default: []
});

export const pageCountState = atom<number>({
  key: 'pageCountState',
  default: 1
});

export const hasMoreState = atom<boolean>({
  key: 'hasMoreState',
  default: true
});

export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: false
});

export const errorState = atom<string | null>({
  key: 'errorState',
  default: null
});