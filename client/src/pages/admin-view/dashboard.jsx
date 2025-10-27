import React, { useEffect } from 'react'
import { useState } from 'react'
import ProductImageUpload from '@/components/admin-view/image-uplaod'
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector} from 'react-redux';
import { addFeatureImages, deleteFeatureImages, getFeatureImages } from '@/store/commonSlice';
import { toast } from 'sonner';

export default function AdminDashboard() {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedimageUrl] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const dispatch = useDispatch();
    const {featureImages} = useSelector((state)=>state.commonFeature)
console.log("uploadedImageUrl", uploadedImageUrl);
console.log("featureImages", featureImages);
  
function handleUploadImage(){
  dispatch(addFeatureImages({uploadedImageUrl})).then((data)=>{  
  if(data.payload.success){
    toast.success(data.payload.message);
    dispatch(getFeatureImages());
    setImageFile(null);
    setUploadedimageUrl("");
    setImageLoading(false);
  }
})
}

function handleDeleteFeature(id){
  console.log("Delete feature image with id:", id);
  dispatch(deleteFeatureImages(id)).then((data)=>{
    if(data.payload.success){
      toast.success(data.payload.message);
      dispatch(getFeatureImages());
    }
  })
 
}

useEffect(()=>{
  dispatch(getFeatureImages())
},[dispatch,featureImages.length])
    return (
    <div>
       <ProductImageUpload
                  file={imageFile}
                  setFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadedImageUrl={setUploadedimageUrl}
                  setImageLoading={setImageLoading}
                  imageLoading={imageLoading}
                  isCustom={true}
                  // currentEditedId={currentEditedId}
                />
                <Button onClick={handleUploadImage} className={`mt-3`}>Upload</Button>
                <div className='flex flex-col gap-4 mt-5'>
                  {
                     featureImages && featureImages.length > 0 ?
                    featureImages.map((item)=>(
                      <div key={item._id} className='relative'>
                        <img src={item.image} alt="feature" className='h-[500px] w-full m-2'/>
                        <Button onClick={() => handleDeleteFeature(item._id)} className='absolute top-2 mt-3 right-2'>Delete</Button>
                      </div>
                    )) : <p>No feature images</p>
                  }
                </div>
    </div>
  )
}
