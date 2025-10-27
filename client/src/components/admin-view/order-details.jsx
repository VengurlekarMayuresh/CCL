import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { updateOrderStatusForAdmin } from "@/store/admin/order-slice";

export default function AdminOrdersDetailsView({ orderDetails }) {
    const initialFormData = {
    status: "",
  }; 
    const [formData, setFormData] = useState(initialFormData);
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();  

  
  const handleOrderStatus = (e) => {
    e.preventDefault();
    const {status} = formData;
    if(status){
      dispatch(updateOrderStatusForAdmin({id: orderDetails._id, orderStatus: status})).then((data)=>{
      if(data?.payload?.success){
         toast.success("Order status updated successfully");
        dispatch(getOrderDetailsForAdmin(orderDetails._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
      }});
     
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID:</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date:</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method:</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status:</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price:</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status:</p>
            <Label>
              <Badge
                className={
                 `py-1 px-3 ${orderDetails?.orderStatus == 'confirmed' ? 'bg-green-500' : orderDetails?.orderStatus == 'rejected' ? 'bg-red-500' : 'bg-black'}`
                }
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4 ">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails.cartItems && orderDetails.cartItems.length > 0
                ? orderDetails.cartItems.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {item.title} (x{item.quantity})
                      </span>
                      <span>${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4 ">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Details</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "inProcess", label: "In Process" },
                  { id: "shipped", label: "Shipped" },
                  { id: "delivered", label: "Delivered" },
                  { id: "returned", label: "Returned" },
                  { id: "cancelled", label: "Cancelled" },
                  { id: "pending", label: "Refunded" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Order Status"
            onSubmit={handleOrderStatus}
          ></CommonForm>
        </div>
      </div>
    </DialogContent>
  );
}
