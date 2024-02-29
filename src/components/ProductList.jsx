import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://api.valantis.store:40000/';
const API_PASSWORD = 'Valantis';

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchProducts();
	}, [currentPage, searchTerm]);

	const fetchProducts = async () => {
		try {
			const response = await axios.get(API_URL + `products?page=${currentPage}&search=${searchTerm}`, {
				headers: {
					Authorization: `Bearer ${API_PASSWORD}`
				}
			});
			setProducts(response.data);
		} catch (error) {
			console.error('Error fetching products:', error.message);
			setError(error.message);
		}
	};

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	const handlePagination = (direction) => {
		setCurrentPage((prevPage) => prevPage + direction);
	};

	return (
		<div>
			<h1>Product List</h1>
			<input type="text" placeholder="Search by name, brand, or price" onChange={handleSearch} />
			{error && <p>Error: {error}</p>}
			<ul>
				{products.map((product) => (
					<li key={product.id}>
						<p>ID: {product.id}</p>
						<p>Name: {product.name}</p>
						<p>Price: {product.price}</p>
						<p>Brand: {product.brand}</p>
					</li>
				))}
			</ul>
			<button disabled={currentPage === 1} onClick={() => handlePagination(-1)}>Previous Page</button>
			<button onClick={() => handlePagination(1)}>Next Page</button>
		</div>
	);
};

export default ProductList;
