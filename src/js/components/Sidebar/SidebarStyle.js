import Color from 'color';

let menuBg = '#2c3e50';
let font = '#ebebeb';
let menuActive = '#69A559';

module.exports = {
  menuBg: menuBg,
  font: font,
  menuActive: menuActive,
  bmListItem:
  {
    base:
    {
      width: '100%',
      maxHeight: 45,
      position: 'relative',
      backgroundColor: Color(menuBg).lighten(0.25).hexString(),
      borderTop: '1px solid ' + Color(menuBg).darken(0.05).hexString(),
      transition: '.5s',
      borderLeft: '0px solid ' + Color(menuActive).darken(0.3).hexString(),
      overflow: 'hidden'
    }
  }
};
