module.exports = (RGBControl) => {
  RGBControl.registerProcessor('arraysteadycolor', (c, arg) => {
    c.setColor([0,0,0]); //setting the color to black since it's there is no single color now.

    let leds = [];
    for(let i=0; i<arg.leds.length; i++)
    {
      let loopLed = arg.leds[i];
      let curColor = c.filterPixel(loopLed.slice(0, 2), (loopLed.length == 4 ? loopLed[3] : 1));


      if(arg.translate)
        curColor = c.translateColor(loopLed.slice(0,2));

      leds.push(curColor[0], curColor[1], curColor[2]);
    }

    c.writeStream(leds);

    c.nextJob();
    //done(null, true);
  });
};
