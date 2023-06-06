import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../assets/logo.png';
import "./menu.css"

const Menu = () => {
  // El hook useState define los estados iniciales
  const [products, setProducts] = useState([]);
  const [productType, setProductType] = useState('breakfast');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [postOrderToKitchen, setPostOrderToKitchen] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // useEffect carga la petición HTTP cuando se renderiza el componente por primera vez.
  useEffect(() => {
    // se guarda el token en el almacenamiento local para que este disponible a lo largo del código.
    const accessToken = localStorage.getItem('token');
    // Primera petición GET http con axios para traer los productos disponibles en la API
    const listProducts = () => {
      axios.get('http://localhost:8080/products', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          setProducts(response.data); 
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
          setError('Error al obtener los datos');
          setIsLoading(false);
        });
    };

    listProducts();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
// separación de tipo desayuno y almuerzo.
  const filterProducts = products.filter(product => product.type === productType);
// pinta los items con .qty 1 en el div de órden =>
// busca si el item clickeado está o no en selectedProducts con el método findIndex, si no está,
// actualiza el estado agregando el item seleccionado a selectedProducts y selectedItems.
  const ProductSelection = (item) => {
    const index = selectedProducts.findIndex(product => product.id === item.id);
    if (index === -1) {
      setSelectedProducts([...selectedProducts, item]);
      setSelectedOrderItems([...selectedOrderItems, { ...item, qty: 1 }]);

    }
  };
 // resetea la vista cada que se clickea en boton desayuno o almuerzo. 
  const clearOrderContainer = () => {
    setSelectedProducts([]);
    setSelectedOrderItems([]);
  };
  // Incrementa en uno el .qty del item seleccionado en 1 utilizando map ??
  const addItemToOrder = (productId) => {
    const updatedOrderItems = selectedOrderItems.map(item => {
      if (item.id === productId) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
    setSelectedOrderItems(updatedOrderItems);
    setSelectedProducts(updatedOrderItems)
  };

  const eraseItemToOrder = (productId) => {
    const updatedOrderItems = selectedOrderItems.map(item => {
      if (item.id !== productId) {
        return item;
      }
      if (item.qty === 0) {
        return { ...item };
      }
      return { ...item, qty: item.qty - 1 };
    }).filter(item => item.qty !== 0);
  
    setSelectedOrderItems(updatedOrderItems);
    setSelectedProducts(updatedOrderItems);
  };
  
  const OrderReadyToKitchen = () => {
    const accessToken = localStorage.getItem('token');

    axios.post('http://localhost:8080/orders', selectedOrderItems, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        setPostOrderToKitchen(response.data); 
        console.log(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Error al obtener los datos');
        setIsLoading(false);
      });
  };

  return (
    <div>
      <div>
        <img src={logo} alt="Logo" />
        <button className='btnBreakfast' onClick={() => { clearOrderContainer(); setProductType('Desayuno') }}>Desayuno</button>
        <button className='btnDinner' onClick={() => { clearOrderContainer(); setProductType('Almuerzo') }}>Almuerzo/Cena</button>
        {filterProducts.map(item => (
          <div key={item.id}>
            <button className='btnItem' onClick={() => ProductSelection(item)}>
              <h3>{item.name}</h3>
              <p>Precio: ${item.price}</p>
              <p>Tipo: {item.type}</p>
            </button>
          </div>
        ))}
        <div className='orderContainer'>
          <h1>Orden</h1>
          {selectedOrderItems.map(product => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>Cantidad: {product.qty}</p>
              <p>Precio: ${product.price}</p>
              <p>Tipo: {product.type}</p>
              <button className='btnAddItem' onClick={() => addItemToOrder(product.id)}>
                <ion-icon name="add-circle-outline"></ion-icon>
              </button>
              <button className='eraseItem' onClick={() => eraseItemToOrder(product.id)}>
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>
          ))}
          <button onClick={OrderReadyToKitchen}>Enviar Órden a cocina</button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
