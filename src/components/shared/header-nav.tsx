import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { usePathname } from '@/routes/hooks';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { useRouter } from '@/routes/hooks';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchShoes } from '@/queries/shoes.query';
import { PagingModel } from '@/constants/data';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}
type ProductType = {
  id: string;
  name: string;
  price: string;
  sales: number;
};

export default function HeaderNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const route = useRouter();
  const { isMinimized } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [pagingModel] = useState(PagingModel);
  const { mutateAsync: searchShoes, isPending } = useSearchShoes();
  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart.cartDetail);
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    } else {
      setProducts([]);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = async () => {
    const pagingSearch = { ...pagingModel, keyword: debouncedSearchTerm };
    const res = await searchShoes(pagingSearch);
    if (res) {
      setProducts(res.listObjects);
      console.log(res);
    }
  };

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid grid-cols-[45%,55%] items-center gap-2">
      <div className="flex space-x-[60px]">
        <TooltipProvider>
          {items.map((item, index) => {
            const Icon = Icons[item.icon || 'arrowRight'];
            return (
              item.href && (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.disabled ? '/' : item.href}
                      className={cn(
                        'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:text-muted-foreground',
                        path === item.href
                          ? 'text-black hover:text-black'
                          : 'transparent',
                        item.disabled && 'cursor-not-allowed opacity-80'
                      )}
                      onClick={() => {
                        if (setOpen) setOpen(false);
                      }}
                    >
                      <Icon
                        className={`size-5 ${index == 0 ? 'stroke-black' : index == 1 ? 'stroke-black' : 'stroke-[#000]'}`}
                      />
                      {isMobileNav || (!isMinimized && !isMobileNav) ? (
                        <div className="flex flex-col">
                          <span
                            className={`${index == 0 ? 'text-000' : index == 1 ? 'text-[#000]' : 'text-[#000]'} truncate text-[14.5px]`}
                          >
                            {item.title}
                          </span>
                          <span className=" truncate text-[10px]">
                            {item.subTitle}
                          </span>
                        </div>
                      ) : (
                        ''
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="right"
                    sideOffset={8}
                    className={!isMinimized ? 'hidden' : 'inline-block'}
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            );
          })}
        </TooltipProvider>
      </div>
      <div className="flex items-center justify-end space-x-3">
        <div className="relative w-[80%]">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm dành cho riêng bạn"
            className="h-8 w-full rounded-md bg-gray-200 px-4 py-5 text-[12px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          ></Input>

          {isFocused && searchTerm && (
            <div className="absolute left-0 right-0 top-12 z-10 max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {isPending ? (
                <div>Loading</div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => {
                      route.push(`product/${product.id}`);
                      setSearchTerm('');
                    }}
                  >
                    {product.name}
                  </div>
                ))
              ) : (
                <div>Chưa có sản phẩm phù</div>
              )}
            </div>
          )}
        </div>
        {/* Hiển thị chi tiết sản phẩm được chọn */}
        {/* {selectedProduct && (
          <div className="mt-4 rounded-md border bg-gray-50 p-4">
            <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
            <p>Giá: {selectedProduct.price}</p>
            <p>Lượt bán: {selectedProduct.sales}</p>
          </div>
        )} */}

        {auth.isLogin ? (
          <>
            <Link to="/cart">
              <div className="font-sm flex gap-2 rounded-lg bg-yellow p-2 font-bold ">
                {cart?.listObjects[0]?.orderItemDetailModels.length}
                <Icons.shoppingCart className="" />
              </div>
            </Link>
            <div
              className="font-sm flex cursor-pointer gap-2 rounded-lg bg-gray-300 p-2 font-bold"
              onClick={() => route.push('/profile')}
            >
              <Icons.user className="" />
            </div>
          </>
        ) : (
          <div className="flex  gap-2 rounded-lg bg-yellow ">
            <Button
              onClick={() => route.push('/login')}
              className=" h-[42px] bg-transparent text-black"
              variant="outline"
            >
              Đăng nhập / Đăng ký
            </Button>
          </div>
        )}

        {/* <UserNav /> */}
      </div>
    </nav>
  );
}
