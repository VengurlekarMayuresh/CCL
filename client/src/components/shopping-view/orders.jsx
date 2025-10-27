import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import {
  getAllOrders,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

export default function ShoppingOrders() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shoppingOrder);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(getAllOrders(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  const handleFetchOrderDetails = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetails(orderId));
  };

  const closeDialog = () => {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
    setSelectedOrderId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>

      <CardContent>
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="align-middle text-left">Order ID</TableHead>
              <TableHead className="align-middle text-left">Order Date</TableHead>
              <TableHead className="align-middle text-left">Order Status</TableHead>
              <TableHead className="align-middle text-left">Order Price</TableHead>
              <TableHead className="align-middle text-center">
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

      {/* Dialog outside the map */}
      <Dialog open={openDetailsDialog} onOpenChange={closeDialog}>
        {orderDetails && <ShoppingOrderDetailsView orderDetails={orderDetails} />}
      </Dialog>
    </Card>
  );
}
