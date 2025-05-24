import { categories } from '../data'
import '../styles/Categories.scss'
import { Link } from 'react-router-dom'

const Categories = () => {
  return (
    <div className='categories'>
      <h1>Top Rate</h1>
      <p style={{ wordWrap: 'break-word' }}>
        Discover our exceptional selection of rental rooms designed to elevate
        your travel experience. Whether you're seeking a cozy retreat or a 
        spacious getaway, our accommodations cater to every traveler's needs.
        Immerse yourself in local culture, indulge in the comforts of home, and
        craft unforgettable memories in your ideal destination.
      </p>

      {/* <div className='categories_list'>
        {categories?.slice(1, 7).map((category) => (
          <Link to={`/properties/category/${category.label}`} key={category.id || category.label}>
            <div className='category'>
              <img src={category.img} alt={category.label} />
              <div className='overlay'></div>
              <div className='category_text'>
                <div className='category_text_icon'>{category.icon}</div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div> */}
    </div>
  )
}

export default Categories