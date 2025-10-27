
export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your User Name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your Email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "password",
    placeholder: "Enter your Password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your Email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "password",
    placeholder: "Enter your Password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormControls = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter Product Title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter Product Description",
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter Product Price",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "electronics", label: "Electronics" },
      { id: "home", label: "Home" },
    ],
  },
  {
    label: "brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Sales Price",
    name: "salesPrice",
    type: "number",
    componentType: "input",
    placeholder: "Enter Sales Price",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    type: "number",
    componentType: "input",
    placeholder: "Enter Total Stock",
  },
];

export const shoppingMenuItems = [
  {
    id: "home",
    label: "Home",
    href: "/shop/home",
  },
  {
    id:'products',
    label: "Products",
    href: "/shop/listings",
  },
  {
    id: "men",
    label: "Men",
    href: "/shop/listings",
  },
  {
    id: "women",
    label: "Women",
    href: "/shop/listings",
  },
  {
    id: "kids",
    label: "Kids",
    href: "/shop/listings",
  },
  {
    id: "footwear",
    label: "Footwear",
    href: "/shop/listings",
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/shop/listings",
  },
  {
    id:"search",
    label: 'Search',
    href: "/shop/search",
  }
];

export const categoryOptions = [
  {
    'men': "Men",
    'women': "Women",
    'kids': "Kids",
    'footwear': "Footwear",
    'accessories': "Accessories",
  },
];

export const brandOptions = [
  { 'nike': "Nike" },
  { 'adidas': "Adidas" },
  { 'puma': "Puma" },
  { 'levi': "Levi" },
  { 'zara': "Zara" },
  { 'h&m': "H&M" },
];

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
    { id: "home", label: "Home" }
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-low-to-high", label: "Price: Low to High" },
  { id: "price-high-to-low", label: "Price: High to Low" },
  { id: "title-a-to-z", label: "Title: A to Z" },
  { id: "title-z-to-a", label: "Title: Z to A" },
  { id: "newest-first", label: "Newest First" },
  { id: "oldest-first", label: "Oldest First" },
];

export const AddressFormControls = [
  {
    label:'Address',
    name:'address',
    componentType:'input',
    type:'text',
    placeholder:'Enter your Address'
  },{
    label:'City',
    name:'city',
    componentType:'input',
    type:'text',
    placeholder:'Enter your City'
  },{
    label:'Pincode',
    name:'pincode',
    componentType:'input',
    type:'number',
    placeholder:'Enter your Pincode'
  },{
    label:'Phone',
    name:'phone',
    componentType:'input',
    type:'number',
    placeholder:'Enter your Phone Number'
  },{
    label:'Notes',
    name:'notes',
    componentType:'textarea',
    type:'text',
    placeholder:'Enter any additional Notes'
  }
]