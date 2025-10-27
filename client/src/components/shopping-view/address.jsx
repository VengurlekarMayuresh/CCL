import { AddressFormControls } from "@/config";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/shop/address-slice";
import AddressCard from "./addressCard";
import { toast } from "sonner";
const initialFormData = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};
export default function Address({ setCurrentAddress,selectedId }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [currentEditAddress, setCurrentEditAddress] = useState(null);

  function handleManageAddress(event) {
    event.preventDefault();
    if(addressList.length >= 3 && !currentEditAddress){
      setFormData(initialFormData);
      setCurrentEditAddress(null);
      toast.error("You can add maximum 3 address")

      return;
    }
    if (currentEditAddress) {
      dispatch(
        editAddress({
          userId: user.id,
          addressId: currentEditAddress,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          console.log(data)
          dispatch(fetchAllAddress(user?.id ));
          setFormData(initialFormData);
          setCurrentEditAddress(null);
          toast.success("Address updated successfully")
        }
      });
    } else {
      dispatch(addNewAddress({ userId: user.id, ...formData })).then((data) => {
        console.log(data);
        if (data.payload.success) {
          dispatch(fetchAllAddress( user?.id ));
          setFormData(initialFormData);
          toast.success("Address added successfully")
        }
      });
    }
  }

  function handleDelete(addressInfo) {
    dispatch(
      deleteAddress({ addressId: addressInfo?._id, userId: user?.id })
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllAddress( user?.id ));
        setFormData(initialFormData);
        setCurrentEditAddress(null);
        toast.success("Address deleted successfully")
      }
    });
  }

  function handleEditAddress(addressInfo) {
    setCurrentEditAddress(addressInfo._id);
    setFormData({ ...addressInfo });
  }

  function isFormDataValid() {
    const ans = Object.entries(formData).every(([key, val]) => {
      if (typeof val === "string") {
        return val.trim() !== "";
      }
      if (typeof val === "number") {
        return !isNaN(val) && val.toString().trim() !== "";
      }
      return false;
    });
    console.log("isFormDataValid", ans);
    return ans;
  }
  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch]);


  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0 ? (
          addressList.map((address) => (    
            <AddressCard
              selectedId={selectedId}
              handleDelete={handleDelete}
              handleEditAddress={handleEditAddress}
              addressInfo={address}
              key={address.id}
              setCurrentAddress={setCurrentAddress}
            />
          ))
        ) : (
          <p>No address found</p>
        )}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditAddress ? "Edit Address" : "Add Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={AddressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditAddress ? "Update " : "Add "}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormDataValid()}
        />
      </CardContent>
    </Card>
  );
}
