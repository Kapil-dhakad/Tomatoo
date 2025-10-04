import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'


const Add = ({url}) => {

  const [image, setImage] = useState([])
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"

  })

  const onChangeHandle = (e) => {
    const name = e.target.name
    const value = e.target.value
    setData(data => ({
      ...data,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", data.price)
    formData.append("category", data.category)
    for (let i = 0; i < image.length; i++) {
      formData.append("images", image[i])
    }

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
      })
      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Salad" })
        setImage([])
        toast.success(response.data.message)
      }
    } catch (err) {
      console.error("Error in submit:", err)
      toast.error("Something went wrong")
    }
    setLoading(false)

  }

  return (
    <div className='add'>
      <form onSubmit={handleSubmit} className='flex-col'>
        <div className='add-img-upload flex-col'>
          <p>Upload Image</p>
          <label htmlFor="image">
            {image.length > 0 ? (
              image.map((img, index) => (
                <img key={index} src={URL.createObjectURL(img)} alt="preview" width="100" />
              ))
            ) : (
              <img src={assets.upload_area} alt="" />
            )}
            <input onChange={(e) => setImage([...e.target.files])} type="file" id="image" multiple hidden required />
          </label>
        </div>
        <div className='add-product-name flex-col'>
          <p>Product name </p>
          <input onChange={onChangeHandle} value={data.name} type="text" name="name" placeholder='Type here' />
        </div>
        <div className='add-product-description flex-col'>
          <p>Add Description</p>
          <textarea onChange={onChangeHandle} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>

        </div>
        <div className='add-category-price'>
          <div className='add-category flex-col'>
            <p>Product category</p>
            <select onChange={onChangeHandle} name="category">
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>

          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandle} value={data.price} type="Number" name="price" placeholder='$20' />
          </div>

        </div>
        <button type='submit' className='add-btn' disabled={loading}>
          {loading ? "Adding..." : "ADD"}
        </button>
      </form>
    </div>
  )
}

export default Add
