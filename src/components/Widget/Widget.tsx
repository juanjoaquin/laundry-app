import { ShoppingCart } from 'lucide-react';
import React from 'react';

interface WidgetProps {
  itemCount: number;
}

export const Widget: React.FC<WidgetProps> = ({ itemCount }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <ShoppingCart />
      {itemCount > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-10px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          {itemCount}
        </div>
      )}
    </div>
  );
};
