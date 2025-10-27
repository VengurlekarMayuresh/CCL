import  {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import api from '@/lib/api'

const initialState={
    isLoading :false,
    featureImages :[],
    message:null
}

export const getFeatureImages = createAsyncThunk(
    'common/getFeatureImages',
    async()=>{
        const response = await api.get('/api/common/feature/get')
        return response.data;
    }
)

export const addFeatureImages = createAsyncThunk(
    'common/addFeatureImages',
    async(imageData)=>{
        const response = await api.post('/api/common/feature/add', {imageData})
        return response.data;
    }
)

export const deleteFeatureImages = createAsyncThunk(
    'common/deleteFeatureImages',
    async(id)=>{
        const response = await api.delete(`/api/common/feature/delete/${id}`)
        return response.data;
    }
)


const commonSlice = createSlice({
    name:'commonSlice',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getFeatureImages.pending,(state)=>{
            state.isLoading = true;
        })
        builder.addCase(getFeatureImages.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.featureImages = action.payload.data;
        })
        builder.addCase(getFeatureImages.rejected,(state)=>{
            state.isLoading = false;
            state.featureImages = [];
        })
        builder.addCase(deleteFeatureImages.pending,(state)=>{
            state.isLoading = true;
        })
        builder.addCase(deleteFeatureImages.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.message = action.payload.message;
        })
        builder.addCase(deleteFeatureImages.rejected,(state)=>{
            state.isLoading = false;
            state.message = null;
        })
        
    }
})

export default commonSlice.reducer;