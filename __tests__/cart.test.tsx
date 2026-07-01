import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '@/components/cart/CartContext';

const localStorageMock = {
  getItem: jest.fn().mockReturnValue(null),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

const sessionStorageMock = {
  getItem: jest.fn().mockReturnValue(null),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock, writable: true });

function TestComponent() {
  const { cart, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart } = useCart();
  return (
    <div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <div data-testid="cart-length">{cart.length}</div>
      <button onClick={() => addItem({ id: '1', name: 'Burger', price: 10, image_url: null })}>
        Add Burger
      </button>
      <button onClick={() => addItem({ id: '2', name: 'Pizza', price: 15, image_url: null })}>
        Add Pizza
      </button>
      <button onClick={() => removeItem('1')}>Remove Burger</button>
      <button onClick={() => updateQuantity('2', 3)}>Update Pizza Qty 3</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
  });

  it('should add an item to the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Burger'));
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('10');
    // localStorage.setItem is called by the persist effect after state update
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should increment quantity if item already exists', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Burger'));
    fireEvent.click(screen.getByText('Add Burger'));
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('20');
  });

  it('should remove an item from the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Burger'));
    fireEvent.click(screen.getByText('Remove Burger'));
    expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
  });

  it('should update quantity correctly', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Pizza'));
    fireEvent.click(screen.getByText('Update Pizza Qty 3'));
    expect(screen.getByTestId('total-items')).toHaveTextContent('3');
    expect(screen.getByTestId('total-price')).toHaveTextContent('45');
  });

  it('should clear the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Burger'));
    fireEvent.click(screen.getByText('Add Pizza'));
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
  });
});