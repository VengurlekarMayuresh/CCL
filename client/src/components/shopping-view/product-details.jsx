import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRating from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";


export default function ProductDetails({ open, setOpen, ProductDetails }) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { products } = useSelector((state) => state.shoppingProducts);
  const { user } = useSelector((state) => state.auth);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const {reviews} = useSelector((state)=>state.shopReview);
  const userId = user?.id;

  function handleAddToCart(productId, getTotalStock) {
    const getCartItems = cartItems || [];

        if (getCartItems.length) {
          const indexOfCurrentItem = getCartItems.findIndex(
            (item) => item.productId === productId
          );
          
          if (indexOfCurrentItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentItem]?.quantity;
            if (getQuantity + 1 > getTotalStock) {
              return toast.error(`Only ${getTotalStock} items in stock`);
            }
          }
        }
    dispatch(addToCart({ userId, productId, quantity: 1 }))
      .then((data) => {
        if (data?.payload.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success("Item added to cart");
        }
      })
      .catch((err) => console.error("Add to cart error:", err));
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

function handleAddReview(){
  dispatch(addReview({
    productId:ProductDetails?._id,
    userId ,
    userName:user?.userName,
    reviewMsg:reviewMsg,
    reviewValue:rating,
    
  })).then(data=>{
    setReviewMsg("");
      setRating(0);
    if(!data?.payload?.success){ 
      console.log(data);
      toast.error(data?.payload?.message || "Failed to add review");
    }else{
      toast.success("Review added successfully");
      handleDialogClose();
    }
  })
}
  function handleRating(star){
    setRating(star);
  }

  useEffect(()=>{
    if(ProductDetails){
      dispatch(getReviews(ProductDetails?._id));
      console.log(reviews);
    }
  },[ProductDetails])

      const averageRating = reviews && reviews.length > 0 ?
      reviews.reduce((acc, review) => acc + review.reviewValue, 0) / reviews.length : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={ProductDetails?.image}
            alt={ProductDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{ProductDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {ProductDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                ProductDetails?.salesPrice > 0 ? "line-through" : ""
              }`}
            >
              ${ProductDetails?.price}
            </p>
            {ProductDetails?.salesPrice > 0 ? (
              <p className="text-3xl font-bold text-primary">
                ${ProductDetails?.salesPrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
             <StarRating rating={averageRating} />
              <span className="text-muted-foreground"> ( {averageRating} ) </span>
            </div>
          </div>
          <div className="mt-5 mb-5">
            {ProductDetails?.totalStock === 0 ? (
              <Button disabled className="w-full bg-red-500 hover:bg-red-600 cursor-not-allowed">
                Out Of Stock{" "}
              </Button>
            ) : (
              <Button
                onClick={() => handleAddToCart(ProductDetails._id, ProductDetails?.totalStock)}
                className="w-full"
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            
            
            <div className="grid gap-6">
              {
               reviews && reviews?.length ? reviews.map((reviewItem)=>(
                <div className="flex gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>{reviewItem?.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{reviewItem?.userName}</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarRating rating={reviewItem?.reviewValue}/>
                  </div>
                  <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                </div>
              </div>
               )
              ): <p>No reviews yet</p>
              }
              
            </div>



            <div className="mt-10 flex flex-col gap-2">
            <Label>Write a review</Label>
            <div className="flex gap-1">
              <StarRating rating={rating} handleRating={handleRating}/>
            </div>
              <Input name='reviewMsg' value={reviewMsg} onChange={(event)=>setReviewMsg(event.target.value)} placeholder="Write a review..." />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim().length === 0}>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
