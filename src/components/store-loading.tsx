export function LoadingStatus({label='دا نحمّل…'}:{label?:string}){
 return <span className="loading-status" role="status"><span className="loading-indicator" aria-hidden="true"/>{label}</span>;
}

export function OrdersLoading({label='دا نحمّل الطلبات…'}:{label?:string}){
 return <div className="orders-loading" role="status"><span className="visually-hidden">{label}</span>{[0,1].map(i=><div className="order-loading-card" key={i} aria-hidden="true"><div className="skeleton-block order-loading-preview"/><div className="order-loading-heading"><span className="skeleton-block skeleton-description"/><span className="skeleton-block skeleton-heading"/><span className="skeleton-block skeleton-price"/><span className="skeleton-block skeleton-button"/></div></div>)}</div>;
}

export function ProductGridLoading({count=8,label='دا نحمّل المنتجات…'}:{count?:number;label?:string}){
 return <div className="catalog-loading" role="status"><span className="visually-hidden">{label}</span><div className="product-grid catalog-skeleton" aria-hidden="true">{Array.from({length:count},(_,i)=><div className="product-skeleton" key={i}><span className="skeleton-block skeleton-photo"/><div className="skeleton-copy"><span className="skeleton-block skeleton-category"/><span className="skeleton-block skeleton-title"/><span className="skeleton-block skeleton-title-short"/><span className="skeleton-block skeleton-price"/><span className="skeleton-block skeleton-button"/></div></div>)}</div></div>;
}

export function CategoryGridLoading(){
 return <div className="category-loading" role="status"><span className="visually-hidden">دا نحمّل الأقسام…</span><div className="category-skeleton-grid" aria-hidden="true">{Array.from({length:6},(_,i)=><div className="category-skeleton" key={i}><span className="skeleton-block skeleton-category-art"/><span className="skeleton-block skeleton-category-name"/></div>)}</div></div>;
}

export function CategoryTabsLoading(){
 return <div className="category-tabs-loading" role="status"><span className="visually-hidden">دا نحمّل الأقسام…</span>{Array.from({length:4},(_,i)=><span key={i} className="skeleton-block" aria-hidden="true"/>)}</div>;
}

export function CategoriesLoading(){
 return <div className="wrap page catalog-page route-loading"><div className="loading-heading" aria-hidden="true"><span className="skeleton-block skeleton-heading"/><span className="skeleton-block skeleton-description"/></div><CategoryTabsLoading/><div className="skeleton-block skeleton-toolbar" aria-hidden="true"/><ProductGridLoading count={6}/></div>;
}

export function ProductLoading(){
 return <div className="wrap page product-page route-loading" role="status"><span className="visually-hidden">دا نحمّل تفاصيل المنتج…</span><div className="product-detail" aria-hidden="true"><div className="skeleton-block skeleton-photo"/><div className="loading-product-details"><span className="skeleton-block skeleton-heading"/><span className="skeleton-block skeleton-description"/><span className="skeleton-block skeleton-description"/><span className="skeleton-block skeleton-price"/><span className="skeleton-block skeleton-options"/><span className="skeleton-block skeleton-button"/></div></div></div>;
}

export function StorefrontLoading(){
 return <div className="wrap home route-loading"><div className="skeleton-block skeleton-banner" aria-hidden="true"/><div className="loading-heading" aria-hidden="true"><span className="skeleton-block skeleton-heading"/></div><CategoryGridLoading/><div className="loading-heading" aria-hidden="true"><span className="skeleton-block skeleton-heading"/></div><ProductGridLoading/></div>;
}
