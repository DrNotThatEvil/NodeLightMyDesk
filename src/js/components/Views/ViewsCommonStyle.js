let menuBg = '#2c3e50';
let font = '#ebebeb';
let menuActive = '#69A559';

const style = {
    menuBg: menuBg,
    font: font,
    menuActive: menuActive,
    base:
    {
        display: 'block',
        width: 300,
        margin: '20px auto',
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        color: '#FFF',
        border: 0,
        ':focus': {
            outline: 'none'
        },
        ':active' : {
            outline: 'none'
        },
        transition: 'background-color 0.5s linear'
    },
    submit:
    {
        backgroundColor: '#2ecc71',
        border: 0,
        padding: 10,
        fontSize: 20,
        width: 330,
        cursor: 'pointer',
        ':active': {
            backgroundColor: '#27ae60'
        },
        ':hover': {
            backgroundColor: '#27ae60'
        }
    },
    submitDisabled:
    {
        backgroundColor: '#929292',
        ':hover' : {
            backgroundColor: '#929292'
        },
        ':active' : {
            backgroundColor: '#929292'
        }
    }
};

module.exports = style;
