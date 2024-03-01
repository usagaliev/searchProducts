import React from 'react';
import {Table} from "antd";

const ProductListTable = ({data}) => {
	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text) => <p className='product-name'>{text}</p>,
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Brand',
			dataIndex: 'brand',
			key: 'brand',
			render: (text) => <p>{text || '---'}</p>,
		},
	]

	const productData = data?.map((item) => {
		const {id, product, price, brand} = item;
		return {
			key: id,
			name: product,
			price: price,
			brand: brand,
		}
	})

	return (
		<Table columns={columns} dataSource={productData} pagination={false} />
	);
};

export default ProductListTable;