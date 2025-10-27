import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
  return (
    <Card className={'p-10 w-[50%] m-10 '}>
      <CardHeader>
        <CardTitle className={'text-4xl'}>Payment Successful</CardTitle>
      </CardHeader>
      <Button className='mt-5' onClick={() => navigate("/shop/account")}>View Orders</Button>
    </Card>
  );
}
