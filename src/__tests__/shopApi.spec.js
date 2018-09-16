import shopApi from '../shopApi';

describe('shoApi', () => {
  const products = {
    productIds: [4],
    quantityById: {
      4: 2
    }
  }

  const address = {
    "fullname": "John Doe",
    "street": "Al. Wilanowska 5",
    "city": "Warszawa",
    "country": "PL"
  }

  const method = "post";

  it('should return list of products', async () => {
    const result = await shopApi.getProducts();

    expect(result.data.products).toBeDefined();
    expect(result.data.products).toBeInstanceOf(Array);
    expect(result.data.products[0]).toMatchObject({});
    expect(result.data.products[0]).toEqual(
      expect.objectContaining({
        id: expect.anything(),
        title: expect.anything(),
        price: expect.anything(),
        image: expect.anything()
      })
    )
  })

  it('should create an order', async () => {
    const result = await shopApi.createOrder(products);

    const expectedResponse = {
      "status": "NEW",
      "orderNumber": expect.any(Number),
      "products": products
    }

    expect(result.data).toMatchObject(expectedResponse);
  })

  it('should update delivery address', async () => {
    const newOrder = await shopApi.createOrder(products);
    const orderNumber = newOrder.data.orderNumber;
    const newAddress = await shopApi.changeDeliveryAddress(orderNumber, address);

    expect(newAddress.data).toMatchObject({
      status: 'OK'
    })

    const order = await shopApi.getOrder(orderNumber);

    expect(order.data).toMatchObject({
      "status": "NEW",
      "orderNumber": orderNumber,
      "products": products,
      "deliveryAddress": address,
    })
  })

  it('should update delivery method', async () => {
    const newOrder = await shopApi.createOrder(products);
    const orderNumber = newOrder.data.orderNumber;
    const newMethod = await shopApi.changeDeliveryMethod(orderNumber, method);

    expect(newMethod.data).toMatchObject({
      status: 'OK'
    })

    const order = await shopApi.getOrder(orderNumber);

    expect(order.data).toMatchObject({
      "status": "NEW",
      "orderNumber": orderNumber,
      "products": products,
      "deliveryMethod": method,
    })
  })

  it('should submit order', async () => {
    const newOrder = await shopApi.createOrder(products);
    const orderNumber = newOrder.data.orderNumber;

    const submitOrder = await shopApi.submitOrder(orderNumber);

    expect(submitOrder.data).toMatchObject({
      status: 'OK'
    })

    const order = await shopApi.getOrder(orderNumber);
    expect(order.data.status).toBe('SUBMITTED')
  })
})