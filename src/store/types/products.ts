export interface ProductReview {
    rating: number
    comment: string
    date: string
    reviewerName: string
    reviewerEmail: string
}

export interface ProductMeta {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
}

export interface ProductDimensions {
    width: number
    height: number
    depth: number
}

export interface ICategory {
    slug: string;
    name: string;
}

export interface Product {
    id: number
    title: string
    description: string
    price: number
    category: string
    thumbnail: string
    discountPercentage: number
    rating: number
    stock: number
    tags: string[]
    brand: string
    sku: string
    weight: number
    dimensions: ProductDimensions
    warrantyInformation: string
    shippingInformation: string
    availabilityStatus: string
    reviews: ProductReview[]
    returnPolicy: string
    minimumOrderQuantity: number
    meta: ProductMeta
    images: string[]
}

export interface ProductsState {
    products: Product[];
    categories: string[];
    filteredProducts: Product[];
    searchQuery: string;
    selectedCategory: ICategory | null;
    sortOption: string;
    sortOrder: "asc" | "desc";
    currentProduct: Product | null;
    totalProducts: number;
    totalPages: number;
    limit: number;
    skip: number;
    currentPage: number;
}
