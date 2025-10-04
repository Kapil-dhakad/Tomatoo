import React from 'react';
import { assets } from '../../assets/assets'; // yahan sahi path set karo
import './Header.css';

const Header = () => {
  return (
    <div 
      className='header'
      style={{
        backgroundImage: `url(${assets.header_img})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',   // ya 'contain' depending on design
        backgroundPosition: 'center',
        height: '34vw',
        position: 'relative',
         borderRadius: '20px',
        margin: '30px auto'
      }}
    >
      <div className='header-contents'>
        <h2>Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
        </p>
        <button className='header_btn'>View Menu</button>
      </div>
    </div>
  )
}

export default Header;
