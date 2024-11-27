import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom } from './Cart'
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const{ enqueueSnackbar} = useSnackbar();

  const [productDetails,setProductDetails] = useState([]);
  const [filteredProduct,setFilteredProduct] = useState([]);
  const [debounceTime,setDebounceTime] = useState(0);

  const [isLoading,setIsLoading] = useState();
  const token = localStorage.getItem('token');

  const [cartItem,setCartItem] = useState([]);

  const [cartLoad,setCartLoad] = useState(false);



  let username = localStorage.getItem('username');
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);
    try{
    let res = await axios.get(`${config.endpoint}/products`);
    setIsLoading(false);
    setProductDetails(res.data);
    setFilteredProduct(res.data);
    setCartLoad(true);
    }catch(e){
      if(e.response && e.response.status === 400){
        enqueueSnackbar(e.response.data.message,{variant:'error'})
      }
    }
    setIsLoading(false);
  };

  useEffect(()=>{
    performAPICall()
  },[]);

  useEffect(()=>{
    fetchCart(token);
  },[cartLoad]);


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setIsLoading(true);
    try{
      let res = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setFilteredProduct(res.data);
    }catch(e){
      if(e.response.status){
        if(e.response.status===404){
          setFilteredProduct([]);
        }
        if(e.response.status===500){
          enqueueSnackbar(e.response.data.message,{variant:'error'});
          setFilteredProduct(productDetails);
        }
      }else{
        enqueueSnackbar(
          'Something went wrong. Check that the backend is running, reachable and returns valid JSON.',{variant:'error'}
        )
      }
    }
    setIsLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    var text = event.target.value;

    if(debounceTimeout){
      clearTimeout(debounceTimeout);
    }
    const newTimeout = setTimeout(()=>{performSearch(text)},500);
    setDebounceTime(newTimeout);
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    let res = await axios.get(`${config.endpoint}/cart`,{
      headers:{
        Authorization:`Bearer ${token}`,
      },
      });
      if(res.status === 200){

        setCartItem(generateCartItemsFrom(res.data,productDetails));


      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };




  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i = 0 ; i < items.length ; i++){
      if(items[i].productId===productId){
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty= 1,
    options = { preventDuplicate: false }
  ) => {
    if(token){
      if(isItemInCart(items,productId)){
        enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',{variant:'error'});
    }else{
      addInCart(productId,qty)
    }
  }else{
    enqueueSnackbar('login to add an item to the cart' , {variant:'error'});
  }
  };


  const addInCart= async (productId,qty)=>{
    try{
      let res = await axios.post(`${config.endpoint}/cart`,
      {productId:productId,
        qty:qty},
      {
        headers:{
        Authorization:`Bearer ${token}`,
      },
    }
      );
      setCartItem(generateCartItemsFrom(res.data,productDetails));
    }catch(e){
      if(e.response && e.response.status===400){
        enqueueSnackbar(e.response.data.message,{variant:'error'});
      }else{
        enqueueSnackbar('could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.',
        {
          variant:'error',
        });
      }
      return null;
    }
  }

  let handleCart = (productId)=>{
    addToCart(
      token,
      cartItem,
      productDetails,
      productId
    )
  };

  let handleQuantity = (productId,qty)=>{
    addInCart(productId,qty);
  };



  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      <TextField className='search-desktop'
      sixe='small'
      fullwidth
        InputProps={{
          endAdornment:(
            <InputAdornment position='end' >
              <Search/>
            </InputAdornment>
          ),
        }}
        placeholder='Search for items/categories'
        name='Search'
        onChange={(e)=>debounceSearch(e,debounceTime)}
      />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{debounceSearch(e,debounceTime)}}
      />
       <Grid container>
        <Grid item container direction='row' justifyContent='center' alignItems='center'
         md={token&& productDetails.length?9:12}>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>

     { isLoading ?(
        <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems = 'center'
        sx={{margin:'auto'}}
        py={10}>
          <CircularProgress size={30}/>
          <h4>Loading Products....</h4>
        </Box>
      ):(
       <Grid container item  spacing={2} direction='row' justifyContent='center' alignItems='center' my={3}
       >
        {
          filteredProduct.length?(
        filteredProduct.map((product)=>(
          <Grid item key={product['_id']} xs={6} md={3} >
            <ProductCard product={product}  
            handleAddToCart={(event)=>handleCart(product["_id"])}
            />
          </Grid>
        ))):(
          <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          py={10}
          sx={{margin:'auto'}}
          >
            <SentimentDissatisfied size={40} />
            <h4>No Products found</h4>
          </Box>
        )}
       </Grid>
       )} 
    </Grid>
    {username&&(
      <Grid  container item xs={12} md={3} justifyContent='center' alignitems='stretch' style={{background:'#E9F5E1',height:'100vh'}}>
        <Cart products={productDetails}
        items={cartItem} 
        handleQuantity={handleQuantity}
      />
        </Grid>
    )}
    </Grid>
      <Footer />
    </div>
  );
};

export default Products;
