import axios from 'axios';
import md5 from 'md5'
import {API_PASSWORD, API_URL, ITEMS_PER_PAGE} from "../constants";

const getCurrentDateUTC = () => {
	const today = new Date();
	const year = today.getUTCFullYear();
	const month = String(today.getUTCMonth() + 1).padStart(2, '0');
	const day = String(today.getUTCDate()).padStart(2, '0');
	return `${year}${month}${day}`;
};

const generateAuthString = () => {
	const timestamp = getCurrentDateUTC();
	return md5(`${API_PASSWORD}_${timestamp}`);
};

const authString = generateAuthString();

const headers = {
	'X-Auth': authString,
	'Content-Type': 'application/json'
};

export const getProductIds = async (currentPage) => {
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;
	const requestData = {
		action: 'get_ids',
		params: {
			offset,
			limit: ITEMS_PER_PAGE
		}
	};

	try {
		return await axios.post(API_URL, requestData, { headers });
	} catch (error) {
		console.error('Ошибка при получении идентификаторов товаров: ', error.message);
	}
};

export const getProductListById = async (ids) => {
	const requestData = {
		action: 'get_items',
		params: {
			ids
		}
	};

	try {
		return await axios.post(API_URL, requestData, { headers });
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error('Проблема с авторизацией');
		} else {
			console.error('Ошибка при получении продуктов: ', error.message);
		}
	}
}

export const getFilteredProductsIds = async (filter, currentPage) => {
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;
	const requestData = {
		action: 'filter',
		params: {...filter, limit: ITEMS_PER_PAGE, offset}
	};

	try {
		return await axios.post(API_URL, requestData, { headers });
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error('Проблема с авторизацией');
		} else {
			console.error('Ошибка при получении продуктов: ', error.message);
		}
	}
}
