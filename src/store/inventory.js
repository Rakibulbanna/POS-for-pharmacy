import { atom } from "jotai";

const data = JSON.parse(localStorage.getItem('inventory')) ? JSON.parse(localStorage.getItem('inventory')) : [];

export const allAddedProducts = atom(data);
// export const Adde = atom(null);
