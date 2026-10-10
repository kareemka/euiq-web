'use client';
import {create} from 'zustand';
import type {CartItem} from './types';
export const useCart=create<{items:CartItem[];setItems:(items:CartItem[])=>void}>(set=>({items:[],setItems:items=>set({items})}));
