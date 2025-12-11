import instance from '.';
import { AppConfig } from '../constants/AppConfig';

export const getProductsAPI = () => {
  return instance.get(`https://fakestoreapi.com/products`);
};





