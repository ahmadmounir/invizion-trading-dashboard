import type { Paging } from "@/shared/types/api";

export const ORDER_STATUSES = [
	"draft",
	"pending",
	"review",
	"paymentRequest",
	"processing",
	"completed",
	"clientFeedback",
	"rejected",
	"cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderBase {
	id: string;
	userId: string;
	username: string;
	userFullName: string;
	operatorId: string | null;
	operatorUsername: string;
	operatorFullName: string;
	tenantId: string;
	tenantName: string;
	productId: string;
	productVariantId: string;
	productCode: string;
	productName: string;
	productImageUrl: string;
	variantName: string;
	categoryId: string;
	categoryName: string;
	firstName: string;
	lastName: string;
	status: OrderStatus;
	statusOn: string;
	createdOn: string;
	paymentStatus: string;
	paymentDate: string;
	canDelete: boolean;
	fullPrice: number | null;
	costPrice: number | null;
	profitPrice: number | null;
}

export interface Order extends OrderBase {
	feedbackFieldsCount: number;
}

export interface OrderFormValueItem {
	value: string;
	hine: string;
	isFile: boolean;
	isImage: boolean;
	mimeType?: string;
	extension?: string;
}

export interface OrderFormValue {
	fieldId: string;
	label: string;
	isFile: boolean;
	type: string;
	values: OrderFormValueItem[];
}

export interface CalculatePriceResult {
	costPrice: number | null;
    profitPrice: number | null,
	deliveryPrice: number | null;
	fullPrice: number | null;
}

export interface CalcPriceRequest {
  tenantId: string;
  deliveryOptionId?: string;
  productVariantId: string;
  priceComponents: string[];
}

export interface CalcPriceComponentItem {
  id: string;
  name: string;
  amount: number;
  category?: string;
}


export interface OrderAttachment {
	id?: string;
	name?: string;
	fileName?: string;
	url?: string;
	fileExtension?: string;
	[key: string]: unknown;
}

export interface OrderPriceComponent {
	id: string;
	componentId: string;
	name: string;
	category: string;
	amount: number;
}

export interface OrderDetails extends OrderBase {
	userEmail: string;
	userPhone: string | null;
	defaultTenant: boolean;
	nationalityCountry: string;
	residencyCountry: string;
	dateOfBirth: string;
	formValues: OrderFormValue[];
	notes: string;
	paymentRequestNotes: string;
	paymentRequestExpiryDate: string;
	deliveryOptionId: string;
	deliveryOptionName: string;
	deliveryOptionPrice: number;
	appointmentNotes: string | null;
	appointmentDate: string;
	feedbackFields: string[];
	attachments: OrderAttachment[];
	priceComponents: OrderPriceComponent[];
}

export interface GetOrdersParams {
	userId?: string;
	statuses?: OrderStatus | OrderStatus[];
	pageSize?: number;
	pageIndex?: number;
}

export interface OrdersResult {
	items: Order[];
	paging?: Paging;
}

export interface UpdateOrderRequest {
	OrderId?: string;
	FirstName: string;
	LastName: string;
	NationalityCountry: string;
	ResidencyCountry: string;
	DateOfBirth: string;
	DeliveryOptionId?: string;
	FormValues: CreateOrderFormValue[]
	PriceComponents: string[];
}

export interface OrderAvailableStatuses {
	availableStatuses: OrderStatus[];
	primaryStatsues: OrderStatus[];
	secondaryStatsues: OrderStatus[];
	inProgressStatsues: OrderStatus[];
	finalStatsues: OrderStatus[];
	waitingClientStatsues: OrderStatus[];
}

export type OrderStep = "eligibility" | "options" | "application" | "submitted";

export interface EligibilityData {
  firstName: string;
  lastName: string;
  citizenshipCountry: string;
  residencyCountry: string;
  dateOfBirth: string;
}

export interface OptionsData {
  selectedPriceComponents: Record<string, string[]>;
  selectedDeliveryOption: string | null;
}

export interface ApplicationFormData {
  [fieldId: string]: string | string[] | File | File[] | boolean | null;
}

export interface CreateOrderFormValueItem {
  value?: string;
  file?: File | null;
}

export interface CreateOrderFormValue {
  fieldId: string;
  translation: boolean;
  values: CreateOrderFormValueItem[];
}

export interface CreateOrderRequest {
  FirstName: string;
  LastName: string;
  NationalityCountry: string;
  ResidencyCountry: string;
  DateOfBirth: string;
  TenantId: string;
  ProductVariantId: string;
  DeliveryOptionId?: string;
  FormValues: CreateOrderFormValue[];
  PriceComponents: string[];
}

export interface CreateOrderData {
  id?: string;
  orderId?: string;
}

export interface FeedbackFormValueItem {
  value?: string;
  file?: File | null;
}

export interface FeedbackFormValue {
  fieldId: string;
  translation: boolean;
  values: FeedbackFormValueItem[];
}

export interface FeedbackFormRequest {
  FormValues: FeedbackFormValue[];
}