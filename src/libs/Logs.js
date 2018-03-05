/* eslint-disable no-unused-vars */
const logCanvas = (canvas, x = 16) => {
  console.log('%c ', [
    'font-size:0',
    `background: url(${canvas.toDataURL()}) `,
    'background-size: contain',
    `padding:${canvas.height / x}px ${canvas.width / x}px`,
    'border: 1px solid #000',
    `line-height:${canvas.height / (x / 2)}px`,
  ].join(';'));
};

/* eslint-disable no-unused-vars */
const logColor = (c) => {
  console.log('%c ', [
    `background: rgb(${c[0]}, ${c[1]}, ${c[2]})`,
    'width: 32px',
    'height: 32px',
  ].join(';'));
};

export { logCanvas, logColor };
