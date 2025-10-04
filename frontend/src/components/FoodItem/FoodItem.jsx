import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const navigate = useNavigate();

  // Function to handle navigation to food details
  const goToDetails = () => {
    navigate(`/food/${id}`);
  };

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        {/* Image click pe details open */}
        <img
          className='food-item-image'
          src={image}
          alt={name}
          onClick={goToDetails}
        />

        {/* Cart buttons */}
        {!cartItems[id] ? (
          <img
            className='addbtn'
            onClick={(e) => {
              e.stopPropagation(); // Taaki image click se conflict na ho
              addToCart(id);
            }}
            src={assets.add_icon_white}
            alt='add'
          />
        ) : (
          <div
            className='food-item-counter'
            onClick={(e) => e.stopPropagation()} // Div click se parent navigate na ho
          >
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt='remove'
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt='add'
            />
          </div>
        )}
      </div>

      <div className='food-item-info'>
        <div className='food-item-name-rating'>
          <p>{name}</p>
          <img src={assets.rating_starts} alt='rating' />
        </div>
        <p className='food-item-desc'>{description}</p>
        <p className='food-item-price'>${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
