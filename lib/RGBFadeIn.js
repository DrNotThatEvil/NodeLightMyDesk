module.exports = (RGBControl) => {
  RGBControl.registerProcessor('fadein', (c, arg) => {
    (function o(d, t, color, trans){
      setTimeout(function () {
        let curColor = c.filterPixel(color, (100-t)/100);
        c.setColor(curColor); // Setting the color must be done before translation

        if(trans)
          curColor = c.translateColor(curColor);

        let leds = [];
        for(let i=0; i<c.getNumLeds(); i++)
        {
          leds.push(curColor[0], curColor[1], curColor[2]);
        }


        c.writeStream(leds);

        if (--t)
        {
          c.progressJob((100-t));
          o(d, t, color, trans);
        }
        else
        {
          c.nextJob();
        }
      }, d);
    })(arg.delay, 100, arg.color, (arg.translate || false));

    //done(null, true);
  });
};
