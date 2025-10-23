import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetOrderUserByStatus } from '@/queries/cart.query';
import { useEffect } from 'react';
import { PagingModel } from '@/constants/data';
import { useState } from 'react';

export default function Order() {
  const [listOrderShipping, setListOrderShipping] = useState<any>([]);
  const { mutateAsync: getOrderStatus } = useGetOrderUserByStatus();
  useEffect(() => {
    handleGetOrderShipping();
  }, []);
  const handleGetOrderShipping = async () => {
    const model = { ...PagingModel, orderStatus: 2 };
    const res = await getOrderStatus(model);
    if (res) {
      console.log(res);
      setListOrderShipping(res.listObjects);
    }
  };

  return (
    <Tabs defaultValue="password" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="password">Đơn hàng đã xác nhận</TabsTrigger>
        <TabsTrigger value="account">Đơn hàng đang giao</TabsTrigger>
      </TabsList>
      <TabsContent value="account"></TabsContent>
      <TabsContent value="password">
        <div className="grid  grid-cols-[25%,45%,30%] items-center p-4">
          <h1 className="mr-2 border-r-2 font-bold">Mã đơn hàng</h1>
          <h1 className="mr-2 border-r-2 font-bold">Sản phẩm</h1>
          <h1 className="text-end font-bold">
            Trạng thái :{' '}
            <span className="text-sm text-green-500">Đang xác nhận</span>{' '}
          </h1>
        </div>
        <div className=" flex flex-col gap-4">
          {listOrderShipping.length > 0 &&
            listOrderShipping?.map((orderConfirm) => (
              <div key={orderConfirm.orderCode} className="border-2 p-4">
                {orderConfirm?.orderItemDetailModels?.map((product, index) => (
                  <div
                    className="grid w-full grid-cols-[25%,75%] pt-2"
                    key={product.id}
                  >
                    <div>
                      {index === 0 && (
                        <p>Mã đơn hàng: {orderConfirm.orderCode}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-[75%,25%]">
                      <div className="flex items-center gap-4">
                        <img
                          className="h-[80px] w-[130px] object-cover duration-300 hover:scale-105"
                          src={product.shoesImage.thumbnail}
                          alt="#"
                        />
                        <div>
                          <p>{product.shoesModel.name} </p>
                          <p className="text-muted-foreground">
                            Size: {product.size}
                          </p>
                          <div className="flex flex-col gap-4">
                            <p>Số lượng: {product.quantity}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mr-4 mt-3 flex w-full justify-end">
                        <div className="flex justify-end gap-4">
                          <div className="flex w-full justify-end">
                            <p className="w-full text-end">
                              Giá:{' '}
                              <span className="text-orange">
                                {product.unitPrice * product.quantity}
                              </span>{' '}
                              đ
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Tổng tiền tạm tính */}
                <div className="grid grid-cols-[25%,75%]">
                  <div></div>
                  <div className="my-3 flex justify-end border-t-2 pt-2">
                    <h1>
                      Tổng tiền (tạm tính):{' '}
                      <span className="text-orange">
                        {orderConfirm?.orderItemDetailModels?.reduce(
                          (acc, cur) => acc + cur.unitPrice * cur.quantity,
                          0
                        )}{' '}
                        đ
                      </span>
                    </h1>
                  </div>
                </div>

                {/* Chi tiết đơn hàng */}
                <div className="mb-4  pb-2">
                  <h1 className="mt-2 text-xl font-bold">Chi tiết đơn hàng</h1>
                  <div className="grid grid-cols-[60%,40%] gap-4">
                    <div className="mt-2 flex flex-col gap-2 border-r-2">
                      <p>Người nhận: {orderConfirm.note} </p>
                      <p>Địa chỉ: {orderConfirm.shipAddress} </p>
                    </div>
                    <div>
                      <div>
                        <p className="font-bold"> Phương thức thanh toán: </p>
                        <p className="font-normal">
                          {orderConfirm.paymentMethod === 1
                            ? 'Thanh toán khi nhận hàng'
                            : 'Chuyển khoản'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
