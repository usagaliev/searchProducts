import React, { useState, useEffect } from 'react';
import {Button} from "antd";
import {debounce} from "lodash";

import {getFilteredProductsIds, getProductIds, getProductListById} from "./helper";
import ProductListTable from "./ProductListTable";

import './style.css'

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [error, setError] = useState(null);
	const [productIds, setProductIds] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchCategory, setSearchCategory] = useState('product');
	const [filterOptions, setFilterOptions] = useState({});
	const [searchTerm, setSearchTerm] = useState('');
	const [stopFetch, setStopFetch] = useState(false);
	useEffect(() => {
		if (stopFetch)
			return
		getProductIds(currentPage).then((response) => {
			setProductIds([...new Set(response.data.result)]);
			setError(null);
		}).catch((error) => {
			setError(error.message);
		});
	}, [stopFetch, currentPage]);

	const fetchProducts = debounce((options) => {
		setIsLoading(true)
		setProductIds([])
		getFilteredProductsIds(options, currentPage)
			.then((response) => {
				setError(null);
				setProductIds([...new Set(response.data.result)]);
				setProducts([])
				setIsLoading(false)
				setStopFetch(true)
			})
			.catch((error) => {
				setError(error.message);
			});
	}, 500)

	useEffect(() => {
		if (productIds?.length === 0) {
			setProducts([]);
			setIsLoading(true);
		}
		getProductListById(productIds).then((response) => {
			setProducts([...new Set(response.data.result)]);
			setIsLoading(false);
			setError(null);
		}).catch((error) => {
			setError(error.message);
		});
	}, [productIds, currentPage]);

	useEffect(() => {
		if (Object.keys(filterOptions).length > 0 && searchTerm.length > 4){
			fetchProducts(filterOptions)
		}
	}, [searchTerm, filterOptions])

	const handleSearch = (event) => {
		const value = event.target.value;
		setSearchTerm(value);
		const filterOpts = {
			[searchCategory]: searchCategory === 'price' ? Number(value) : value
		}
		setFilterOptions(filterOpts)
		if (!value || value.length === 0) {
			setIsLoading(true);
			getProductIds(currentPage).then((response) => {
				setProductIds([...new Set(response.data.result)]);
				setError(null);
				setIsLoading(false);
			}).catch((error) => {
				setError(error.message);
			});
		}
	};

	const handlePagination = (direction) => {
		setIsLoading(true);
		setProducts([])
		setCurrentPage((prevPage) => prevPage + direction);
	};

	const handleCategoryChange = (event) => {
		setSearchCategory(event.target.value);
	};

	return (
		<div className='products-container'>
			<h1>Product List</h1>
			<div className='search-container'>
				<select value={searchCategory} onChange={handleCategoryChange} className='products-select'>
					<option value="product">Product</option>
					<option value="brand">Brand</option>
					<option value="price">Price</option>
				</select>
				<input
					type="text"
					className='products-search'
					placeholder="Search by name, brand, or price"
					onChange={handleSearch}
					onPaste={handleSearch}
				/>
			</div>
			{/*{error && <p>Error: {error}</p>}*/}
			{isLoading ?
				(
					<p>Загружаем товары...</p>
				) : (
					<div className='products-table'>
						<ProductListTable data={products}/>
					</div>
				)}
			<div className='pagination'>
				<Button disabled={currentPage === 1} onClick={() => handlePagination(-1)}>Previous Page</Button>
				<Button onClick={() => handlePagination(1)}>Next Page</Button>
			</div>
		</div>
	);
};

export default ProductList;
