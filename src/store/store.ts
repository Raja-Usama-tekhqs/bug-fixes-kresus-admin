import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import slices, { nonPersisiterSlice } from "./slices";

const persistConfig = {
  key: "root",
  storage: storage,
};


const persistedReducer = persistReducer(persistConfig, slices);
const nonPersistedReducer = nonPersisiterSlice.reducer;
export const store = configureStore({
  reducer: {
    states: persistedReducer,
    nonPersistedState: nonPersistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
