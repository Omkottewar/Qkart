import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
<Card className="card" >
      <CardMedia component='img' alt='Image Description' height='140' image={product.image} />
      <CardContent>
        <Typography gutterBottom variant='body2' component='div'>
        {product.name}
        </Typography>
        <Typography variant ='h6' sx={{fortWeight:'bold'}} mb={1} component='div'>
         ${product.cost}
        </Typography>
        <Rating value={product.rating} readOnly> </Rating>
      </CardContent>
      <CardActions className="card-actions">
        <Button className='card-button' fullWidth variant='contained' onClick={()=>handleAddToCart()} >
         <AddShoppingCartOutlined/> ADD TO CART
        </Button>
      </CardActions>

    </Card>
  );
};

export default ProductCard;
