module.exports = (RGBControl) => {
    RGBControl.registerProcessor('fadein', (c, arg) => {
        (function o(d, t, color){
            setTimeout(function () {
                let curColor = c.filterPixel(color, (100-t)/100);
                let leds = [];
                for(let i=0; i<c.getNumLeds(); i++)
                {
                    leds.push(curColor[0], curColor[1], curColor[2]);
                }

                c.setColor(curColor);
                c.writeStream(leds);

                //console.log('fadein:', t);

                if (--t)
                {
                    c.progressJob((100-t));
                    o(d, t, color);
                }
                else
                {
                    c.nextJob();
                }
            }, d);
        })(arg.delay, 100, arg.color);

        //done(null, true);
    });
};
