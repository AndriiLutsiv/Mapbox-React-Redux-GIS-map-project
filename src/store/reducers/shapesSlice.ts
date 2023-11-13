import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shape, shapes } from 'components/Map/styles/shapes';

const initialState: Shape[] = [
    ...shapes, 
];

const shapesSlice = createSlice({
    name: 'shapes',
    initialState,
    reducers: {
        addShape: (state, action: PayloadAction<Shape>) => {
            state.push(action.payload);
        },
        addArrayOfShapes: (state, action: PayloadAction<Shape[]>) => {
            const arrayOfShapes = action.payload;

            for(let i = 0; i < arrayOfShapes.length; i++) {
                if(state.findIndex((el) => el.name === arrayOfShapes[i].name) === -1) {
                    state.push(arrayOfShapes[i]);
                }
            }
        },
    },
});

export const selectShapes = (state: any) => state.shapes;

export const { addShape, addArrayOfShapes } = shapesSlice.actions;

export default shapesSlice.reducer;
