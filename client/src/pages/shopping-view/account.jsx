import React from "react";
import accPhoto from "../../assets/acc_photo.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

export default function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accPhoto}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList className="h-12">
              <TabsTrigger className="text-md p-3 m-1 rounded-sm" value="orders">Orders</TabsTrigger>
              <TabsTrigger className="text-md p-3 m-1 rounded-sm"value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders"><ShoppingOrders/></TabsContent>
            <TabsContent value="address"><Address/></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
