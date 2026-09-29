"use client";

import { createContext, useContext } from "react";

/*
 * The store's own details (name, city, phone, hours, policies) from the admin's Store settings.
 * The root layout loads them once per request and provides them here, so shared components such
 * as the header and footer can show them without every screen passing them down.
 *
 *   function components:  const store = useStore();
 *   class components:     static contextType = StoreContext;  then  this.context
 */
export const StoreContext = createContext(null);

export function useStore() {
  return useContext(StoreContext);
}

export default function StoreProvider({ store, children }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
