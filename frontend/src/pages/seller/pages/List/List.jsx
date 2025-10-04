import React, { useEffect } from 'react'
import './List.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({url}) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }
  const removeFood = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/food/remove/${id}`)

      if (response.data.success) {
        toast.success(response.data.message)

        // ✅ UI se turant hatao
        setList(prevList => prevList.filter(item => item._id !== id))

      }
      else {
        toast.error("Failed to remove food")
      }

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }



  useEffect(() => {
    fetchList()
  }, [])



  return (

    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img
                src={item.image[0]}   // 👈 direct use karo
                alt={item.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              {/* for all images */}
              {/* <div className="food-images">
                {item.image && item.image.map((img, i) => (
                  <img
                    key={i}
                    src={img}   // 👈 ye already full URL hai
                    alt={item.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "5px" }}
                  />
                ))}
              </div> */}


              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)}>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
