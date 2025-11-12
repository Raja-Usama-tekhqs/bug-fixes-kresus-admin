import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { boilerPlateProject, boilerPlateProjectNonPersisit } from 'type/slicesType';


const initialState: boilerPlateProject = {
  token: 'kresus@NdQsnWI4VIw8bIqUgw5h_+LJmpsZ2sfm7li8DjgbVo',
  
};
const initialStateNonPersisit: boilerPlateProjectNonPersisit = {
  notPersist: null
};
export const nonPersisiterSlice = createSlice({
  name: 'boiler-plate-projectNonPersisitSlices',
  initialState: initialStateNonPersisit,
  reducers: {
    setNotPersist: (state, action: PayloadAction<string>) => {
      state.notPersist = action.payload;
    },
  },
});

export const Slices = createSlice({
  name: 'boiler-plate-project',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});


export const {
  setToken
} = Slices.actions;

export default Slices.reducer;

export const { setNotPersist } = nonPersisiterSlice.actions;
