const tools = {
  PEN: window.Symbol('PEN'),
  BRUSH: window.Symbol('BRUSH'),
  ERASER: window.Symbol('ERASER'),
  SPOIT: window.Symbol('SPOIT'),
  FILL: window.Symbol('FILL'),
  COLOR: window.Symbol('COLOR'),
  fromName: (name) => {
    switch (name) {
      case 'pen':
        return tools.PEN;
      case 'brush':
        return tools.BRUSH;
      case 'eraser':
        return tools.ERASER;
      case 'spoit':
        return tools.SPOIT;
      case 'fill':
        return tools.FILL;
      case 'color':
        return tools.COLOR;
      default:
        return undefined;
    }
  },
};

export default tools;
