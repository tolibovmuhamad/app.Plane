import { createContext, useContext } from 'react';
import type { TFModel } from './useTaskFlow';

export const TFContext = createContext<TFModel | null>(null);

export function useTF(): TFModel {
  const ctx = useContext(TFContext);
  if (!ctx) throw new Error('useTF must be used within <TFContext.Provider>');
  return ctx;
}
