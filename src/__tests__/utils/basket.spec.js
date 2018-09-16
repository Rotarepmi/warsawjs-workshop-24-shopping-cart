import Basket from "../../utils/basket";

describe('Class Basket', () => {
  it('should add product to basket', () => {
    const b = new Basket();    
    expect(b.products()).toHaveLength(0);

    b.add({ name: 'Produkt 1'});
    expect(b.products()).toHaveLength(1);
    expect(b.products()).toContainEqual({ name: 'Produkt 1' });
  })

  it('should remove product from basket', () => {
    const b = new Basket();    
    expect(b.products()).toHaveLength(0);

    b.add({ name: 'Produkt 1'});
    expect(b.products()).toHaveLength(1);

    b.remove({ name: 'Produkt 1'});
    expect(b.products()).toHaveLength(0);
  })

  it('should return true while has products basket', () => {
    const b = new Basket();    
    expect(b.products()).toHaveLength(0);

    b.add({ name: 'Produkt 1'});
    expect(b.hasProduct({ name: 'Produkt 1' })).toBe(true);
  })
})