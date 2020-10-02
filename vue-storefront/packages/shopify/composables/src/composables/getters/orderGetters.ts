/* istanbul ignore file */

import { UserOrderGetters } from '@vue-storefront/core';
import { Order, OrderItem } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getDate = (order: Order): string => order.processedAt;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getId = (order: Order): string => order.name;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getStatus = (order: Order): string => order.financialStatus;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPrice = (order: Order): number | null => order.totalPriceV2.amount;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItems = (order: Order): OrderItem[] => order.lineItems;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItemSku = (item: OrderItem): string => item.title;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItemName = (item: OrderItem): string => item.title;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItemQty = (item: OrderItem): number => item.quantity;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItemPrice = (item: OrderItem): number => item.originalTotalPrice.amount;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormattedPrice = (price: number) => String(price);

const orderGetters: UserOrderGetters<Order, OrderItem> = {
  getDate,
  getId,
  getStatus,
  getPrice,
  getItems,
  getItemSku,
  getItemName,
  getItemQty,
  getItemPrice,
  getFormattedPrice
};

export default orderGetters;
