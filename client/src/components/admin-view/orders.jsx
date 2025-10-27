import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrdersDetailsView from "./order-details";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const dispatch = useDispatch();
  const { orderDetails, orderList } = useSelector((state) => state.adminOrder);

  function handleFetchOrderDetails(orderId) {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetailsForAdmin(orderId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  function closeDialog() {
    setOpenDetailsDialog(false);
    setSelectedOrderId(null);
    dispatch(resetOrderDetails());
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Order ID</TableHead>
              <TableHead className="text-left">Order Date</TableHead>
              <TableHead className="text-left">Order Status</TableHead>
              <TableHead className="text-left">Order Price</TableHead>
              <TableHead className="text-center">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell className="text-left">{orderItem._id}</TableCell>
                  <TableCell className="text-left">
                    {orderItem.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell className="text-left">
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem.orderStatus.toLowerCase() === "confirmed"
                          ? "bg-green-500"
                          : orderItem.orderStatus.toLowerCase() === "rejected"
                          ? "bg-red-500"
                          : "bg-black"
                      }`}
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">${orderItem.totalAmount}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFetchOrderDetails(orderItem._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* ✅ Dialog placed outside the map and controlled via state */}
      <Dialog open={openDetailsDialog} onOpenChange={closeDialog}>
        {orderDetails && <AdminOrdersDetailsView orderDetails={orderDetails} />}
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;
