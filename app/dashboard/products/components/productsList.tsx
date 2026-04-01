import { Product } from "../types/products.type"
import { getImageUrl } from "../services/products.service"

type Props = {
    products: Product[]
    handleEditOpen: (product: Product) => void
}

export default function ProductsList({ products, handleEditOpen }: Props) {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.map(product => (
                    <div
                        key={product.id}
                        className="bg-card text-card-foreground border border-border rounded-xl overflow-hidden flex flex-col shadow-sm hover:border-primary/50 transition-colors duration-200"
                    >
                        {/* Product Image */}
                        <div className="relative h-40 bg-muted overflow-hidden">
                            {product.image_path ? (
                                <img
                                    src={getImageUrl(product.image_path)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-muted-foreground/30"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 19a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
                                    </svg>
                                </div>
                            )}
                            {/* Price badge */}
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
                                ₱{product.price.toFixed(2)} Current Stock: {product.limited_quantity}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-4 flex flex-col flex-1 gap-3">
                            <h3 className="text-foreground font-semibold text-base leading-tight">
                                {product.name}
                            </h3>

                            {/* Ingredients */}
                            {product.product_ingredients && product.product_ingredients.length > 0 && (
                                <div className="flex-1">
                                    <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2 font-medium">
                                        Ingredients
                                    </p>
                                    <ul className="space-y-1.5">
                                        {product.product_ingredients.map((pi, idx) => (
                                            <li key={idx} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    {pi.inventory.image_path ? (
                                                        <img
                                                            src={getImageUrl(pi.inventory.image_path)}
                                                            alt={pi.inventory.name}
                                                            className="w-5 h-5 rounded-full object-cover border border-border"
                                                        />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                                                            <span className="text-[8px] text-muted-foreground">•</span>
                                                        </div>
                                                    )}
                                                    <span className="text-muted-foreground">{pi.inventory.name}</span>
                                                </div>
                                                <span className="text-muted-foreground font-mono">
                                                    {pi.quantity} {pi.inventory.measurement}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Cost estimate */}
                            {product.product_ingredients && product.product_ingredients.length > 0 && (
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <span className="text-muted-foreground text-xs">Est. Cost</span>
                                    <span className="text-muted-foreground text-xs font-mono">
                                        ₱{product.product_ingredients
                                            .reduce((sum, pi) => sum + pi.quantity * pi.inventory.price_per_serving, 0)
                                            .toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div>
                            {/* Category */}
                            {product.category && (
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <span className="text-muted-foreground text-xs">Category</span>
                                    <span className="text-muted-foreground text-xs font-mono">
                                        {product.category.category_name}
                                    </span>
                                </div>
                            )}
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => handleEditOpen(product)}
                                className="mt-auto w-full py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary transition-all duration-200"
                            >
                                Edit Product
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {products?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM12 12h.01" />
                    </svg>
                    <p className="text-sm">No products yet</p>
                </div>
            )}
        </div>
    )
}